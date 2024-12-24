public class CaseHelper {
    public static void updateCaseStatus(List<Case> cases) {
        for (Case c : cases) {
            if (c.Priority == 'High') {
                c.Status = 'In Progress';
            } else if (c.Priority == 'Low') {
                c.Status = 'Pending';
            }
        }
    }
}