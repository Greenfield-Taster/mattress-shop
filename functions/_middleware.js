// Cloudflare Pages edge middleware.
// The project is always reachable on its technical *.pages.dev URL, which
// cannot be disabled. To avoid SEO duplicate-content and keep a single
// canonical host, permanently redirect the public pages.dev alias to the
// custom domain. Preview deployment hostnames (<hash>.just-sleep.pages.dev)
// are intentionally NOT matched, so preview builds stay debuggable.
export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "just-sleep.pages.dev") {
    url.protocol = "https:";
    url.hostname = "just-sleep.com.ua";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
