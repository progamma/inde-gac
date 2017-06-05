Documentazione INDE GAC
================================


Lo script permette di utilizzare il componente framework GAC di Instant Developer Cloud, in grado di generare documenti di reportistica direttamente sullo spazio Google Drive.
----------------
### Importazione script
Il primo passo da eseguire è quello di importare lo script sul proprio spazio cloud.
* Accedi a Google Drive da browser https://www.google.com/intl/it/drive/.
* Clicca sul bottone "Nuovo" e nel menù a tendina che si aprirà seleziona Altro -> Collega altre applicazioni
* Nella finestra che si aprirà cerca "Google Apps Script" e clicca su "Collega"
* Una volta che l'applicazione sarà collegata clicca su sul bottone "Nuovo" e nel menù a tendina che si aprirà seleziona Altro -> Google Apps Script
* Copia e incolla il contenuto di "script.js" nell'editor dello script sostituendo tutto il contenuto inserito per default
* All'interno dello script editor clicca su: Pubblica -> Distribuisci come API eseguibile, inserisci i dati richiesti e quindi completa l'operazione cliccando su "Distribuisci"
* Fai clic su File -> Proprietà del progetto e prendi nota dello Script ID che sarà un parametro da utilizzare all'interno del codice su Instant Developer Cloud.


### Impostazione API e credenziali
Il secondo passo da eseguire è quello di configurare le API e le credenzialiper potersi autenticare ed eseguire lo script da remoto.
* All'interno dello script editor clicca su: Risorse -> Progetto Cloud Platform, nell pop-up che si aprirà clicca il link che si trova sotto "Questo script al momento è associato al progetto:" così da accedere alle impostazioni del progetto Cloud.
* Clicca sul bottone "Abilita API" e nella nuova finestra cerca e seleziona "Google Apps Script Execution API", infine clicca su "Abilita"
* Dal menù di sinistra clicca su "Credenziali" e nella nuova finestra su "Crea Credenziali -> ID client OAuth"
* Seleziona come tipo di applicazione "Applicazione web", dai il nome che desideri e clicca su crea, prendi nota dell'ID client e del client secret che ti verranno mostrati.

The server is configured via the `config.json` file. An example can be found in `basedir/IDServer/server/config-example.json`.
When working in production, `basedir/config/config.json` is loaded.

The file is a JSON formatted object, with the following properties:

*[PM2](https://github.com/Unitech/pm2).

