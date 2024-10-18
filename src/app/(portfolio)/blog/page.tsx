import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog/manage";

export default async function Page(){
    const posts = await getAllPosts()
    
    return (<>̥
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post,i) => (
          <Card key={post.slug || i}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
              <p>{post.description}</p>
            </CardContent>
            <CardFooter className="underline font-semibold text-blue-600">
              <a href={`/blog/${post.slug}`}>
                Read more
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </>);
}