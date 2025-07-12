import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import { useAuth } from "@/components/auth-context";
import { useIsMobile, useScreenSize } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionSchema } from "@shared/schema";
import { z } from "zod";

const questionFormSchema = insertQuestionSchema.extend({
  title: z.string().min(10, "Title must be at least 10 characters long"),
  content: z.string().min(20, "Question details must be at least 20 characters long"),
  tags: z.string().transform((val) => 
    val.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
  ).pipe(z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed")),
});

export default function AskQuestion() {
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const screenSize = useScreenSize();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const questionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof questionFormSchema>) => {
      return apiRequest("POST", "/api/questions", {
        ...data,
        authorId: user?.id,
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Question posted",
        description: "Your question has been posted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post question",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof questionFormSchema>) => {
    questionMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-4">You must be logged in to ask a question.</p>
            <Link href="/login">
              <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                Log In
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${screenSize === 'mobile' ? 'flex-col' : 'flex-row'} gap-6`}>
          {screenSize === 'desktop' && <Sidebar />}
          
          <main className="flex-1 max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ask a Question</h1>
              <p className="text-gray-600">
                Get help from our community by asking a detailed question.
              </p>
            </div>

            <Card>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's your programming question? Be specific."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500">
                            Write a clear, descriptive title that summarizes your problem.
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Details</FormLabel>
                          <div className="border rounded-md">
                            {/* Toolbar */}
                            <div className="border-b bg-gray-50 px-3 py-2 flex items-center gap-1 text-sm">
                              <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                                <strong>B</strong>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                                <em>I</em>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                                Link
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                                Code
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                                List
                              </Button>
                              <div className="ml-auto text-xs text-gray-500">
                                Markdown supported
                              </div>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Provide details about your question. Include what you've tried and what specific help you need.

Example:
```javascript
// Your code here
function example() {
  return 'hello world';
}
```

**What I tried:**
1. First I tried...
2. Then I attempted...

**Expected result:** 
What should happen

**Actual result:**
What actually happens"
                                rows={12}
                                className="border-0 rounded-none rounded-b-md resize-none focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                          <p className="text-sm text-gray-500">
                            Use markdown formatting for code blocks, lists, and emphasis. Include relevant code, error messages, and describe what you've tried.
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Add up to 5 tags separated by commas (e.g., javascript, react, authentication)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500">
                            Tags help others find and answer your question.
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Link href="/">
                        <Button variant="outline">
                          Cancel
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        disabled={questionMutation.isPending}
                        className="bg-stackit-blue text-white hover:bg-stackit-blue-dark"
                      >
                        {questionMutation.isPending ? "Posting..." : "Post Question"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </Card>
          </main>

          {screenSize === 'desktop' && <RightSidebar />}
        </div>
      </div>
    </div>
  );
}
