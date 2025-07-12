import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import VoteButtons from "@/components/vote-buttons";
import { useAuth } from "@/components/auth-context";
import { useIsMobile, useScreenSize } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnswerSchema } from "@shared/schema";
import { z } from "zod";
import type { Question, Answer } from "@shared/schema";

const answerFormSchema = insertAnswerSchema.extend({
  content: z.string().min(10, "Answer must be at least 10 characters long"),
});

export default function QuestionPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const screenSize = useScreenSize();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof answerFormSchema>>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: {
      content: "",
      questionId: parseInt(id!),
    },
  });

  const { data: question, isLoading: questionLoading } = useQuery<Question>({
    queryKey: ["/api/questions", id],
    enabled: !!id,
  });

  const { data: answers, isLoading: answersLoading } = useQuery<Answer[]>({
    queryKey: ["/api/questions", id, "answers"],
    enabled: !!id,
  });

  const answerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof answerFormSchema>) => {
      return apiRequest("POST", "/api/answers", {
        ...data,
        authorId: user?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/questions", id, "answers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post answer",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof answerFormSchema>) => {
    answerMutation.mutate(data);
  };

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Mock author data
  const getAuthor = (authorId: number) => ({
    username: authorId === 1 ? "john_doe" : 
              authorId === 2 ? "alice_smith" : "mike_johnson",
    reputation: authorId === 1 ? 1234 : 
                authorId === 2 ? 567 : 2891,
  });

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
            <p className="text-gray-600 mb-4">The question you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                Back to Questions
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const author = getAuthor(question.authorId);

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${screenSize === 'mobile' ? 'flex-col' : 'flex-row'} gap-6`}>
          {screenSize === 'desktop' && <Sidebar />}
          
          <main className="flex-1 max-w-4xl">
            {/* Question */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex gap-6">
                  <VoteButtons
                    targetId={question.id}
                    targetType="question"
                    currentVotes={question.votes}
                  />

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      {question.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {question.views} views
                      </span>
                      <span>asked {formatTimeAgo(question.createdAt)}</span>
                    </div>
                    
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Author Info */}
                    <div className="flex justify-end">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-2">asked {formatTimeAgo(question.createdAt)}</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-semibold">
                              {getInitials(author.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{author.username}</p>
                            <p className="text-xs text-stackit-blue font-medium">
                              {author.reputation.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Answers */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {question.answerCount} Answer{question.answerCount !== 1 ? 's' : ''}
              </h2>
              
              {answersLoading ? (
                <Card className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </Card>
              ) : answers && answers.length > 0 ? (
                <div className="space-y-4">
                  {answers.map((answer) => {
                    const answerAuthor = getAuthor(answer.authorId);
                    return (
                      <Card key={answer.id}>
                        <div className="p-6">
                          <div className="flex gap-6">
                            <VoteButtons
                              targetId={answer.id}
                              targetType="answer"
                              currentVotes={answer.votes}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="prose max-w-none mb-6">
                                <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                              </div>

                              {answer.accepted && (
                                <div className="mb-4">
                                  <Badge className="bg-stackit-green text-white">
                                    <Check size={12} className="mr-1" />
                                    Accepted Answer
                                  </Badge>
                                </div>
                              )}

                              {/* Answer Author Info */}
                              <div className="flex justify-end">
                                <div className="bg-green-50 rounded-lg p-4">
                                  <p className="text-xs text-gray-500 mb-2">
                                    answered {formatTimeAgo(answer.createdAt)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-semibold">
                                        {getInitials(answerAuthor.username)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-gray-900">{answerAuthor.username}</p>
                                      <p className="text-xs text-stackit-blue font-medium">
                                        {answerAuthor.reputation.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 mb-4">No answers yet.</p>
                  {isAuthenticated && (
                    <p className="text-sm text-gray-400">Be the first to answer this question!</p>
                  )}
                </Card>
              )}
            </div>

            {/* Answer Form */}
            {isAuthenticated ? (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Answer</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your answer here..."
                                rows={8}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={answerMutation.isPending}
                          className="bg-stackit-blue text-white hover:bg-stackit-blue-dark"
                        >
                          {answerMutation.isPending ? "Posting..." : "Post Your Answer"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 mb-4">You must be logged in to post an answer.</p>
                <Link href="/login">
                  <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                    Log In
                  </Button>
                </Link>
              </Card>
            )}
          </main>

          {screenSize === 'desktop' && <RightSidebar />}
        </div>
      </div>
    </div>
  );
}
