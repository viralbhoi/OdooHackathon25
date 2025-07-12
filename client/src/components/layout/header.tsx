import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, SquareStack, Menu, Filter, Clock, MessageSquareOff, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-context";
import { useIsMobile, useIsTablet, useScreenSize } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const screenSize = useScreenSize();

  const { data: popularTags } = useQuery({
    queryKey: ["/api/tags/popular"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <SquareStack className="text-stackit-blue text-2xl mr-2" size={32} />
            <span className="text-xl font-bold text-gray-900">StackIt</span>
          </Link>

          {/* Search Bar */}
          <div className={`flex-1 max-w-2xl ${screenSize === 'mobile' ? "mx-4" : "mx-8"}`}>
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 focus:ring-stackit-blue focus:border-transparent"
                />
              </form>
              
              {/* Popular Tags - Inline with search, hidden on mobile */}
              {screenSize !== 'mobile' && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Popular:</span>
                  {popularTags?.slice(0, screenSize === 'tablet' ? 2 : 3).map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-stackit-blue hover:text-white transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation and User Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile and Tablet Navigation Menu */}
            {(screenSize === 'mobile' || screenSize === 'tablet') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated && (
                    <DropdownMenuItem>
                      <Link href="/ask" className="flex items-center w-full text-stackit-blue font-semibold">
                        <Plus size={16} className="mr-2" />
                        Ask Question
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link href="/" className="flex items-center w-full">
                      Questions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tags" className="flex items-center w-full">
                      Tags
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/users" className="flex items-center w-full">
                      Users
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">Unanswered</span>
                  </DropdownMenuItem>
                  {/* Show more popular tags in tablet dropdown */}
                  {screenSize === 'tablet' && popularTags && popularTags.length > 3 && (
                    <div className="px-2 py-1 border-t">
                      <p className="text-xs font-semibold text-gray-500 mb-1">More Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {popularTags?.slice(3, 7).map((tag: any) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-stackit-blue hover:text-white"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}



            {/* User Actions */}
            {isAuthenticated ? (
              <>
                {/* Ask Question Button */}
                <Link href="/ask">
                  <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark flex items-center">
                    <Plus size={16} className="mr-1" />
                    {screenSize === 'mobile' ? "Ask" : "Ask Question"}
                  </Button>
                </Link>
                
                {/* Notification Bell */}
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                    <Badge className="absolute -top-1 -right-1 bg-stackit-red text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <Link href={`/profile/${user?.id}`}>
                    <Button variant="ghost" size="sm" className="text-stackit-blue hover:text-stackit-blue-dark">
                      {isMobile ? user?.username?.slice(0, 8) + "..." : user?.username}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isMobile ? "Exit" : "Logout"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-stackit-blue hover:text-stackit-blue-dark font-medium">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
