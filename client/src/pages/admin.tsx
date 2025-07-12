import { useQuery } from "@tanstack/react-query";
import { Users, HelpCircle, MessageSquare, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/components/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";

export default function Admin() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: questions } = useQuery({
    queryKey: ["/api/questions"],
  });

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-stackit-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Link href="/">
              <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                Back to Home
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Mock data for admin dashboard
  const recentUsers = [
    { id: 1, username: "new_user1", email: "user1@example.com", joinedAt: "2 hours ago", status: "active" },
    { id: 2, username: "new_user2", email: "user2@example.com", joinedAt: "1 day ago", status: "active" },
    { id: 3, username: "new_user3", email: "user3@example.com", joinedAt: "2 days ago", status: "pending" },
  ];

  const flaggedContent = [
    { id: 1, type: "question", title: "Inappropriate question title", reporter: "user123", reportedAt: "1 hour ago" },
    { id: 2, type: "answer", title: "Spam answer content", reporter: "user456", reportedAt: "3 hours ago" },
    { id: 3, type: "question", title: "Off-topic discussion", reporter: "user789", reportedAt: "5 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6`}>
          {!isMobile && <Sidebar />}
          
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage and monitor the StackIt community.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAnswers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Questions Today</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.questionsToday || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.joinedAt}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Flagged Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Flagged Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flaggedContent.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{item.reportedAt}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                          <p className="text-xs text-gray-500">Reported by {item.reporter}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Review
                          </Button>
                          <Button size="sm" variant="destructive" className="text-xs">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions?.slice(0, 5).map((question: any) => (
                    <div key={question.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Link href={`/question/${question.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-stackit-blue cursor-pointer mb-2">
                            {question.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{question.votes} votes</span>
                          <span>{question.answerCount} answers</span>
                          <span>{question.views} views</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
