import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { join } from "https://deno.land/std@0.208.0/path/mod.ts"

const port = 8000

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname === "/" ? "/index.html" : url.pathname
  
  try {
    const file = await Deno.readFile(join(Deno.cwd(), path))
    return new Response(file, {
      headers: {
        "content-type": path.endsWith(".html") ? "text/html" :
                       path.endsWith(".css") ? "text/css" :
                       path.endsWith(".js") || path.endsWith(".ts") || path.endsWith(".tsx") ? "text/javascript" :
                       "text/plain"
      }
    })
  } catch {
    return new Response("Not Found", { status: 404 })
  }
}

console.log(`Server running at http://localhost:${port}`)
await serve(handler, { port }) 