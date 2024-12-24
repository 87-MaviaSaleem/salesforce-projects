/**
* @File Name : EventLogger.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : November 12, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 12, 2024 |   | Initial Version
**/

public class EventLogger {
	@AuraEnabled
	Public static void logEvent(String eventName, String eventType,String eventTarget ){
		System.debug('Lightning Studio');
	}
}