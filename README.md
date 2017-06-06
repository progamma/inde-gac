Instant Developer Google Api Connector 
================================


Lo script permette di utilizzare il componente framework GAC di Instant Developer Cloud che ti consente di generare documenti di reportistica direttamente sul tuo spazio Google Drive.
----------------
### Importazione script
La prima fase consiste nell'importare lo script sul proprio spazio cloud.
* Accedi a Google Drive da browser https://www.google.com/intl/it/drive/.
* Clicca sul bottone `Nuovo` e nel menù a tendina che si aprirà seleziona `Altro -> Collega altre applicazioni`.
* Nella finestra che si aprirà cerca `Google Apps Script` e clicca su `Collega`.
* Una volta che l'applicazione sarà collegata clicca su sul bottone `Nuovo` e nel menù a tendina che si aprirà seleziona `Altro -> Google Apps Script`.
* Copia e incolla il contenuto di [script.js](https://github.com/progamma/inde-gac/blob/master/script.js) nell'editor dello script sostituendo tutto il contenuto inserito per default.
* All'interno dello script editor clicca su: `Pubblica -> Distribuisci come API eseguibile` inserisci i dati richiesti e quindi completa l'operazione cliccando su `Distribuisci`.
* Fai clic su `File -> Proprietà del progetto` e prendi nota dello Script ID che sarà un parametro da utilizzare all'interno del codice su Instant Developer Cloud.

### Creazione API e credenziali
In questa fase configuriamo le API e creiamo le credenziali per potersi autenticare ed eseguire lo script da remoto.
* All'interno dello script editor clicca su: `Risorse -> Progetto Cloud Platform`, nell pop-up che si aprirà clicca il link che si trova sotto `Questo script al momento è associato al progetto:` così da accedere alle impostazioni del progetto Cloud.
* Clicca sul bottone `Abilita API` e nella nuova finestra cerca e seleziona `Google Apps Script Execution API`, infine clicca su `Abilita`.
* Dal menù di sinistra clicca su `Credenziali` e nella nuova finestra su `Crea Credenziali -> ID client OAuth`
* Seleziona come tipo di applicazione `Applicazione web`, dai il nome che desideri e clicca su crea, prendi nota dell'ID client e del client secret che ti verranno mostrati.

### Configurazione origini Javascript e URI di reindirizzamento 
Dopo aver creato le credenziali per poterle utilizzare è necessario configurare alcuni parametri.
* Clicca sulla chiave OAuth appena creata, ti verrà mostrata la pagina di configurazione dove è necessario aggiungere le origini consentite e gli URI di reindirizzamento: 
* se siamo in fase di sviluppo:
  * Origini JavaScript autorizzate         
  in questo campo bisogna aggiungere l'url del server di sviluppo su cui si lavora, per esempio se stai utilizzando il server di default l'origine da inserire sarà:  
  https://ide1-developer.instantdevelopercloud.com
  * URI di reindirizzamento autorizzati   
  in questo campo aggiungeremo invece l'url dove Google ci reindirezzerà dopo l'autorizzazione dal prompt di google, dobbiamo quindi scrivere l'url dell'applicazione in esecuzione con questi parametri in più:   
  `<url server>/preview.html?appUrl=/<session ID>/<App ID>/run&device=<device>&mode=rest&cmd=gauth`    
  questo per poter recuperare all'interno dell'evento onCommand dell'applicazione il codice di accesso che la API di Google aggiunge come parametro GET all'url di reindirizzamento. (Per maggiori informazioni consultare la Documentazione del framework su Instant Developer Cloud).   
  Esempio URL di autorizzazione:  
  http://host/app/client/preview.html?appUrl=/8e97cd80-1930-4200-a5ef-b3ba2580d0c6/pfcM12LrJ%2Fd%2F%2FMXfSHLMvQ%3D%3D/run&device=desktop&mode=rest&cmd=gauth

**NOTA BENE**: l'url di reindirizzamento che passerei alle API deve essere identico a uno di quelli impostati, indi per cui se si vuole utilizzare il metodo generateAuthUrl della classe GAC in fase di sviluppo sarà necessario modificare l'impostazione dell'OAuth client ogni qual volta il session ID cambia, fatto che accade quando si chiude il progetto e lo si riapre.

* se siamo in fase di produzione
  * Origini JavaScript autorizzate      
  in questo campo bisogna aggiungere l'url del server di produzione su cui è installata l'applicazione, per esempio per la console di Instant developer inseriremo:   
  https://console.instantdevelopercloud.com
  * URI di reindirizzamento autorizzati   
  similmente al caso di sviluppo inseriremo:  
  `<url applicazione>/<nome app>?&mode=rest&cmd=gauth`   
  in questo caso dato che l'URL è statico e sempre noto una volta configurato correttamente non sarà più necessario alcun intervento.  
  Esempio URL di autorizzazione per il Cloud Control Center:  
  https://console.instantdevelopercloud.com/CCC?mode=rest&cmd=gauth

Una volta eseguiti correttamente questi passi sarà possibile utilizzare la classe GAC del framework, per informazioni su di essa consulta direttamente la documentazione presente all'interno dell'IDE.   
Per ulteriori informazioni sulla Google Execution API  e sul ciclo di autorizzazione consulta [la documentazione ufficiale](https://developers.google.com/apps-script/guides/rest/api).
