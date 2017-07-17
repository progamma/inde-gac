Instant Developer Google Apps Connect
================================


Lo script permette di utilizzare il componente framework GAC di Instant Developer Cloud che consente di generare documenti di reportistica direttamente sullo spazio Google Drive.
----------------
### Importazione script
La prima fase consiste nell'importare lo script sul proprio spazio cloud.
* Accedere a Google Drive da browser:
  https://www.google.com/drive/.
* Cliccare sul bottone `New` e nel menu a tendina che si aprirà selezionare `More -> Connect more apps`.
* Nella finestra che si aprirà cercare `Google Apps Script` e cliccare su `Connect`.
* Una volta che l'applicazione sarà collegata, cliccare sul bottone `New` e nel menu a tendina che si aprirà selezionare `More -> Google Apps Script`.
* Copiare e incollare il contenuto di [script.js](https://github.com/progamma/inde-gac/blob/master/script.js) nell'editor dello script sostituendo tutto il contenuto inserito per default.
* All'interno dello script editor cliccare su: `Publish -> Deploy as API executable`, inserire il numero di versione e lasciare `Who has access to the script` impostato su: `Only myself` quindi completare l'operazione cliccando su `Deploy`.
* Cliccare su `File -> Project properties` prendendo così nota dello Script ID che sarà un parametro da utilizzare all'interno del codice su Instant Developer Cloud.

### Creazione API e credenziali
In questa fase si devono configurare le API e creare le credenziali per potersi autenticare ed eseguire lo script da remoto.
* All'interno dello script editor cliccare su: `Resources -> Cloud Platform project`, nel pop-up che si aprirà cliccare il link che si trova sotto `This script is currently associated with project:` così da accedere alle impostazioni del progetto Cloud.
* Cliccare sul bottone `Enable API` e nella nuova finestra cercare e selezionare `Google Apps Script Execution API`, infine cliccare su `Enable`.
* Dal menu di sinistra cliccare su `Credentials` e nella nuova finestra su `Create credentials -> OAuth client ID`
* Selezionare come tipo di applicazione `Web application`, dopo aver dato il nome desiderato cliccare su `Create`, **si prenda nota dell'ID client e del client secret che ti verranno mostrati.**

### Configurazione origini Javascript e URI di reindirizzamento 
Dopo aver creato le credenziali per poterle utilizzare è necessario configurare alcuni parametri.
* Cliccare sulla chiave OAuth appena creata, verrà mostrata la pagina di configurazione dove è necessario aggiungere le origini consentite e gli URI di reindirizzamento: 
* se si è in fase di sviluppo:
  * `Authorised JavaScript origins`         
  in questo campo bisogna aggiungere l'URL del server di sviluppo su cui si lavora, per esempio:  
  http://ide-xyz.instantdevelopercloud.com
  * `Authorised redirect URIs`   
  in questo campo si imposterà l'URL dove Google reindirizza dopo l'autorizzazione dal prompt, si scriva l'URL dell'applicazione in esecuzione con questi parametri in più:   
  `<URL server>/<session ID>/<App ID>/run?mode=rest&cmd=<cmd>`    
   per poter recuperare all'interno dell'evento onCommand dell'applicazione il codice di accesso che la API di Google aggiunge come parametro GET all'URL di reindirizzamento. (Per maggiori informazioni consultare la Documentazione del framework su Instant Developer Cloud).   
  Esempio URL:  
  http://ide-xyz.instantdevelopercloud.com/8e97cd80-1930-4200-a5ef-b3ba2580d0c6/pfcM12LrJ%2Fd%2F%2FMXfSHLMvQ%3D%3D/run?mode=rest&cmd=gauth
  
**NOTA BENE**: l'URL di reindirizzamento che si passa alle API deve essere identico a uno di quelli impostati, quindi se si vuole utilizzare il metodo generateAuthUrl della classe GAC in fase di sviluppo sarà necessario modificare l'impostazione dell'OAuth client ogni qual volta il session ID cambia, fatto che accade quando si chiude il progetto e lo si riapre.

* se si è in fase di produzione
  * `Authorised JavaScript origins`      
  in questo campo bisogna aggiungere l'URL del server di produzione su cui è installata l'applicazione, per esempio:
  https://myserver.com
  * `Authorised redirect URIs`   
  similmente al caso di sviluppo si deve inserire:  
  `<URL applicazione>/<nome app>?&mode=rest&cmd=<cmd>`   
  in questo caso dato che l'URL è statico e sempre noto una volta configurato correttamente non sarà più necessario alcun intervento.  
  Esempio URL di autorizzazione  
  https://myserver/myappname?mode=rest&cmd=gauth

Una volta eseguiti correttamente questi passi sarà possibile utilizzare la classe GAC del framework, per informazioni su di essa consultare direttamente la documentazione presente all'interno dell'IDE.   
Per ulteriori informazioni sulla Google Execution API  e sul ciclo di autorizzazione consultare [la documentazione ufficiale](https://developers.google.com/apps-script/guides/rest/api).
