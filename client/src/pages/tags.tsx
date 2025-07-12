import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RightSidebar from "@/components/layout/right-sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { useState } from "react";
import type { Tag } from "@shared/schema";

export default function Tags() {
  const screenSize = useScreenSize();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-stackit-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex ${screenSize === 'mobile' ? 'flex-col' : 'flex-row'} gap-6`}>
          {screenSize === 'desktop' && <Sidebar />}
          
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tags</h1>
              <p className="text-gray-600">
                Browse topics and technologies discussed in our community.
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:ring-stackit-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Tags Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTags.map((tag) => (
                    <Card key={tag.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <Link href={`/?tag=${encodeURIComponent(tag.name)}`}>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 text-sm font-medium"
                            >
                              {tag.name}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {tag.useCount} questions
                            </span>
                          </div>
                          {tag.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {tag.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>

                {filteredTags.length === 0 && searchQuery && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No tags found matching "{searchQuery}"</p>
                  </Card>
                )}

                {!searchQuery && (
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      Showing {filteredTags.length} tags
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