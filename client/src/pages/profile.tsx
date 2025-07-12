import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Award, MessageSquare, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import QuestionCard from "@/components/question-card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User, Question } from "@shared/schema";

export default function Profile() {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", id],
    enabled: !!id,
  });

  const { data: userQuestions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/users", id, "questions"],
    enabled: !!id,
  });

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          </Card>
        </div>
      </div>
    );
  }

  // Mock questions data for the user
  const questionsWithAuthors = userQuestions?.map((question) => ({
    ...question,
    author: {
      username: user.username,
      reputation: user.reputation,
    }
  })) || [];

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6`}>
          {!isMobile && <Sidebar />}
          
          <main className="flex-1 max-w-4xl">
            {/* User Profile Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-2xl font-semibold">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Member since {formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={16} />
                        <span className="text-stackit-blue font-semibold">{user.reputation.toLocaleString()} reputation</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="text-stackit-blue" size={20} />
                    <span className="text-2xl font-bold">{questionsWithAuthors.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-stackit-green" size={20} />
                    <span className="text-2xl font-bold">0</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Reputation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-500" size={20} />
                    <span className="text-2xl font-bold">{user.reputation.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User's Questions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Questions ({questionsWithAuthors.length})
              </h2>
              
              {questionsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-6">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : questionsWithAuthors.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 mb-4">This user hasn't asked any questions yet.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {questionsWithAuthors.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}
            </div>
          </main>

          {!isMobile && <RightSidebar />}
        </div>
      </div>
    </div>
  );
}
