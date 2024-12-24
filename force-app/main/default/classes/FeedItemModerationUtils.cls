public class FeedItemModerationUtils {
    // Method to check if content contains any of the provided keywords
    public static Boolean containsOffensiveWords(String content, Set<String> keywords) {
        if (content != null) {
            for (String keyword : keywords) {
                if (content.contains(keyword)) {
                    return true; // Return true if any keyword is found in the content
                }
            }
        }
        return false; // Return false if no keywords are found
    }
}