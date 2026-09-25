import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { build } from "esbuild";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { draftKey, type DraftFields } from "../lib/editor-draft";

test("editor recovery, navigation guard, failed save and successful cleanup", async () => {
  const dom = new JSDOM('<div id="root"></div>', {url: "http://localhost/admin/posts/new"});
  const globals = {window: dom.window, document: dom.window.document, location: dom.window.location, localStorage: dom.window.localStorage, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, FormData: dom.window.FormData, IS_REACT_ACT_ENVIRONMENT: true};
  const previous = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(globals)) { previous.set(name, Object.getOwnPropertyDescriptor(globalThis,name)); Object.defineProperty(globalThis,name,{value, configurable: true, writable: true}); }
  const directory = await mkdtemp(`${process.cwd()}/.editor-test-`);
  let root: import("react-dom/client").Root | undefined;
  const {act, createElement} = await import("react");
  try {
    const result = await build({entryPoints: ["components/post-editor.tsx"], bundle: true, platform: "node", format: "esm", jsx: "automatic", packages: "external", write: false, plugins: [{name: "test-navigation", setup(builder) {
      builder.onResolve({filter: /^next\/navigation$/}, () => ({path: "router", namespace: "test"}));
      builder.onLoad({filter: /.*/, namespace: "test"}, () => ({contents: 'export const useRouter = () => ({ push: url => { window.savedDestination = url }, refresh: () => {} });', loader: "js"}));
    }}]});
    await writeFile(`${directory}/editor.mjs`, result.outputFiles[0].text);
    const {PostEditor} = await import(pathToFileURL(`${directory}/editor.mjs`).href);
    const {createRoot} = await import("react-dom/client");
    const initial: DraftFields = {title: "", slug: "", excerpt: "", category: "Cerita", status: "draft", cover_url: "", body: "<p></p>"};
    const key = draftKey("admin");
    let succeed = false;
    const action = async () => succeed ? {saved: true} : {error: "Slug sudah digunakan."};
    const mount = async () => { root = createRoot(document.getElementById("root")!); await act(async () => root!.render(createElement(PostEditor,{initial, userId: "admin", publishedAt: "", action}))); };
    await mount();
    const title = document.querySelector('input[name="title"]') as HTMLInputElement;
    await act(async () => {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,"value")!.set!.call(title,"Tulisan terselamatkan");
      title.dispatchEvent(new dom.window.Event("input", {bubbles: true}));
    });
    await act(async () => { const canvas = document.querySelector('[role="textbox"]')!; canvas.innerHTML='<p>Isi penting</p>'; canvas.dispatchEvent(new dom.window.Event("input",{bubbles:true})); });
    await act(async () => { await new Promise(resolve => setTimeout(resolve,900)); });
    assert.match(localStorage.getItem(key)!, /Tulisan terselamatkan/);
    assert.match(localStorage.getItem(key)!, /Isi penting/);
    dom.window.confirm = () => false;
    const cancel = document.querySelector('a[href="/admin"]')!;
    const click = new dom.window.MouseEvent("click",{bubbles:true,cancelable:true});
    await act(async () => { cancel.dispatchEvent(click); });
    assert.equal(click.defaultPrevented,true);
    const leave = new dom.window.Event("beforeunload", {cancelable:true});
    await act(async () => { dom.window.dispatchEvent(leave); });
    assert.equal(leave.defaultPrevented,true);
    await act(async () => root!.unmount());
    await mount();
    assert.match(document.body.textContent!, /Ada cadangan/);
    await act(async () => { Array.from(document.querySelectorAll('button')).find(b => b.textContent === "Pulihkan cadangan")!.click(); });
    assert.equal((document.querySelector('input[name="title"]') as HTMLInputElement).value,"Tulisan terselamatkan");
    assert.match(document.querySelector('[role="textbox"]')!.innerHTML,/Isi penting/);
    await act(async () => { document.querySelector('form')!.requestSubmit(); });
    assert.match(document.querySelector('[role="alert"]')!.textContent!,/Slug sudah/);
    assert.ok(localStorage.getItem(key));
    succeed = true;
    await act(async () => { document.querySelector('form')!.requestSubmit(); });
    assert.equal(localStorage.getItem(key),null);
    assert.equal((dom.window as unknown as {savedDestination:string}).savedDestination,"/admin");
  } finally {
    if (root) await act(async () => root!.unmount());
    await rm(directory,{recursive:true,force:true}); dom.window.close();
    for(const [name,descriptor] of previous) { if(descriptor) Object.defineProperty(globalThis,name,descriptor); else Reflect.deleteProperty(globalThis,name); }
  }
});
