import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function RightSidebar() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      user: { name: "Tom Davis", initials: "TD" },
      action: "answered",
      question: "How to handle async operations...",
      time: "5 minutes ago",
    },
    {
      id: 2,
      user: { name: "Lisa Wang", initials: "LW" },
      action: "asked",
      question: "Best practices for API design",
      time: "12 minutes ago",
    },
    {
      id: 3,
      user: { name: "Robert Garcia", initials: "RG" },
      action: "accepted an answer for",
      question: "JavaScript closure concepts",
      time: "1 hour ago",
    },
  ];

  // Mock top contributors data
  const topContributors = [
    { id: 1, name: "Sarah Johnson", initials: "SJ", answers: 127, reputation: 15678 },
    { id: 2, name: "David Miller", initials: "DM", answers: 94, reputation: 12543 },
    { id: 3, name: "Emma Lee", initials: "EL", answers: 76, reputation: 9876 },
  ];

  return (
    <aside className="lg:w-80 flex-shrink-0">
      {/* Statistics Widget */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Questions</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats?.totalQuestions || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Answers</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats?.totalAnswers || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Users</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats?.activeUsers || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Questions Today</span>
            <span className="text-sm font-semibold text-stackit-green">
              {stats?.questionsToday || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-semibold">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                  <span className="text-stackit-blue hover:underline cursor-pointer">
                    "{activity.question}"
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {topContributors.map((contributor) => (
            <div key={contributor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold">
                    {contributor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                  <p className="text-xs text-gray-500">{contributor.answers} answers</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-stackit-blue">
                {contributor.reputation.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
