Instant Developer Google Apps Connect
================================


The script allows you to use the Instant Developer Cloud GAC framework, which will let you generate reporting documents directly on the Google Drive space.
----------------
### Importing the script
The first step is to import the script to your cloud space.
* Access Google Drive from a browser:
  https://www.google.com/drive/.
* Click `New` and select `More -> Connect more apps` in the drop-down menu that appears.
* In the window that opens, search for `Google Apps Script` and click `Connect`.
* Once the application is connected, click `New` and select `More -> Google Apps Script` in the drop-down menu that appears.
* Copy and paste the content of [script.js](https://github.com/progamma/inde-gac/blob/master/script.js) into the script editor, replacing all of the default content.
* In the script editor, click: `Publish -> Deploy as API executable`, enter the version number and leave `Who has access to the script` set to: `Only myself`, and then complete the operation by clicking `Deploy`.
* Click `File -> Project properties` and make a note of the Script ID, which will be a parameter to be used in the code in Instant Developer Cloud.

### Creating APIs and credentials
In this phase you need to configure the APIs and create the credentials so that you can authenticate and run the script remotely.
* In the script editor click: `Resources -> Cloud Platform project`. In the pop-up that opens, click the link you'll find under `This script is currently associated with project:` to access the Cloud project settings.
* Click `Enable API`. In the new window find and select `Google Apps Script Execution API`, and click `Enable`.
* In the menu on the left, click `Credentials` and in the new window click `Create credentials -> OAuth client ID`.
* Select `Web application` as the application type. After you've created the name you want, click `Create`, **Make a note of the client ID and the client secret that will be shown.**

### Configuring JavaScript origins and redirect URIs 
Once you've created the credentials, you need to configure a few parameters in order to use them.
* Click the OAuth key that was just created. The configuration page will be shown, and there you need to add the allowed origins and the redirect URIs: 
* If during development:
  * `Authorized JavaScript origins`         
  in this field you need to add the URL of the development server you're working with, for example:  
  http://ide-xyz.instantdevelopercloud.com
  * `Authorized redirect URIs`   
  in this field you'll set the URL where Google will redirect after authorization from the prompt. Enter the URL of the application running, adding these parameters as well:   
  `<URL server>/<session ID>/<App ID>/run?mode=rest&cmd=<cmd>`    
   in order to retrieve inside the onCommand event of the application the access code that the Google API adds to the redirect URL as a GET parameter. (For more information, read the framework documentation on Instant Developer Cloud).   
  Example URL:  
  http://ide-xyz.instantdevelopercloud.com/8e97cd80-1930-4200-a5ef-b3ba2580d0c6/pfcM12LrJ%2Fd%2F%2FMXfSHLMvQ%3D%3D/run?mode=rest&cmd=gauth
  
**WARNING**: the redirect URL that is sent to the APIs must be the same as one of those set, so if you want to use the GAC class generateAuthUrl method during development, you'll need to change the setting of the OAuth client every time the session ID changes, which occurs when you close the project and open it again.

* If during production
  * `Authorized JavaScript origins`      
  in this field you need to add the URL of the production server the application is installed on. For example:
  https://myserver.com
  * `Authorized redirect URIs`   
  similar to the development example, you need to enter:  
  `<application URL>/<app name>?&mode=rest&cmd=<cmd>`   
  in this case, given that the URL is static and is always known, once it has been configured as a redirect URL, no further action is necessary.  
  Example of authorization URL  
  https://myserver/myappname?mode=rest&cmd=gauth

The framework GAC class can be used once these steps are completed correctly. Consult the documentation in the IDE directly for information on this class.   
For more information about Google Execution API and the authorization cycle, consult [the official documentation](https://developers.google.com/apps-script/guides/rest/api).
