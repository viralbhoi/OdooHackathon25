import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Award, MessageSquare, Users as UsersIcon } from "lucide-react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { useState } from "react";
import type { User } from "@shared/schema";

export default function Users() {
  const screenSize = useScreenSize();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${screenSize === 'mobile' ? 'flex-col' : 'flex-row'} gap-6`}>
          {screenSize === 'desktop' && <Sidebar />}
          
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <UsersIcon className="mr-2" size={24} />
                Users
              </h1>
              <p className="text-gray-600">
                Discover and connect with community members.
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:ring-stackit-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Users Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                      <Link href={`/profile/${user.id}`}>
                        <div className="cursor-pointer">
                          {/* User Avatar and Basic Info */}
                          <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold">
                                {getInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {user.username}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getRoleColor(user.role)}`}
                              >
                                {user.role}
                              </Badge>
                            </div>
                          </div>

                          {/* User Stats */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Award size={14} className="mr-2 text-stackit-blue" />
                              <span className="font-medium text-stackit-blue">
                                {user.reputation.toLocaleString()}
                              </span>
                              <span className="ml-1">reputation</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <MessageSquare size={14} className="mr-2" />
                              <span>Member since {formatDate(user.createdAt)}</span>
                            </div>
                          </div>

                          {/* User Bio/Email (if available) */}
                          <div className="text-sm text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>

                {filteredUsers.length === 0 && searchQuery && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No users found matching "{searchQuery}"</p>
                  </Card>
                )}

                {!searchQuery && (
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      Showing {filteredUsers.length} users
                    </p>
                  </div>
                )}
              </>
            )}
          </main>

          {screenSize === 'desktop' && <RightSidebar />}
        </div>
      </div>
    </div>
  );
}