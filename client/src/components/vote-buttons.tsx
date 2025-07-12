import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/hooks/use-toast";

interface VoteButtonsProps {
  targetId: number;
  targetType: "question" | "answer";
  currentVotes: number;
  className?: string;
}

export default function VoteButtons({ 
  targetId, 
  targetType, 
  currentVotes, 
  className = "" 
}: VoteButtonsProps) {
  const [votes, setVotes] = useState(currentVotes);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const voteMutation = useMutation({
    mutationFn: async (voteType: "up" | "down") => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to vote");
      }

      return apiRequest("POST", "/api/votes", {
        targetId,
        targetType,
        voteType,
        userId: user?.id,
      });
    },
    onSuccess: (response) => {
      // Update local vote count optimistically
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      if (targetType === "question") {
        queryClient.invalidateQueries({ queryKey: ["/api/questions", targetId] });
      }
      
      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record vote",
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: "up" | "down") => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "You must be logged in to vote",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update
    setVotes(prev => prev + (voteType === "up" ? 1 : -1));
    voteMutation.mutate(voteType);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 flex-shrink-0 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("up")}
        disabled={voteMutation.isPending}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-stackit-blue transition-colors"
      >
        <ChevronUp size={20} />
      </Button>
      
      <span className="text-lg font-semibold text-gray-700">
        {votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("down")}
        disabled={voteMutation.isPending}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-stackit-red transition-colors"
      >
        <ChevronDown size={20} />
      </Button>
    </div>
  );
}
