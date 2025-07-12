import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import QuestionCard from "@/components/question-card";
import { useAuth } from "@/components/auth-context";
import { useIsMobile, useScreenSize } from "@/hooks/use-mobile";
import type { Question } from "@shared/schema";

export default function Home() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const searchQuery = searchParams.get("search");
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const screenSize = useScreenSize();
  const [activeFilter, setActiveFilter] = useState("newest");

  const { data: questions, isLoading } = useQuery({
    queryKey: searchQuery ? ["/api/questions/search", searchQuery] : ["/api/questions"],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/questions/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/questions";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      return response.json();
    },
  });

  // Mock user data for questions
  const questionsWithAuthors = questions?.map((question: Question) => ({
    ...question,
    createdAt: new Date(question.createdAt),
    updatedAt: new Date(question.updatedAt),
    author: {
      username: question.authorId === 1 ? "john_doe" : 
                question.authorId === 2 ? "alice_smith" : "mike_johnson",
      reputation: question.authorId === 1 ? 1234 : 
                  question.authorId === 2 ? 567 : 2891,
    }
  })) || [];

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${screenSize === 'mobile' ? 'flex-col' : 'flex-row'} gap-6`}>
          {screenSize === 'desktop' && <Sidebar />}
          
          {/* Main Content */}
          <main className="flex-1">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Questions"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {questionsWithAuthors.length} question{questionsWithAuthors.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {isAuthenticated && (
                <Link href="/ask">
                  <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark flex items-center">
                    <Plus size={16} className="mr-2" />
                    Ask Question
                  </Button>
                </Link>
              )}
            </div>

            {/* Filter Tabs */}
            {!searchQuery && (
              <Card className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { key: "newest", label: "Newest" },
                      { key: "active", label: "Active" },
                      { key: "unanswered", label: "Unanswered" },
                      { key: "votes", label: "Most Voted" },
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeFilter === filter.key
                            ? "border-stackit-blue text-stackit-blue"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {isLoading ? (
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
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? "No questions found for your search." : "No questions yet."}
                  </p>
                  {isAuthenticated && (
                    <Link href="/ask">
                      <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                        Ask the First Question
                      </Button>
                    </Link>
                  )}
                </Card>
              ) : (
                questionsWithAuthors.map((question: any) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              )}
            </div>

            {/* Pagination */}
            {questionsWithAuthors.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" disabled className="text-sm">
                    Previous
                  </Button>
                  
                  <Button className="bg-stackit-blue text-white text-sm">1</Button>
                  <Button variant="outline" className="text-sm">2</Button>
                  <Button variant="outline" className="text-sm">3</Button>
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                  <Button variant="outline" className="text-sm">15</Button>
                  
                  <Button variant="outline" className="text-sm">
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </main>

          {!isMobile && <RightSidebar />}
        </div>
      </div>
    </div>
  );
}
