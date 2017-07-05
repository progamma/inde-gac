/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2016
 * All rights reserved
 */


/**
 *Execute the operation request by Inde GAC API
 * @param {Object} options
 *   -templateName: the name of the template file in Google Drive
 *   -filePath:  output path file (including a name)
 *   -formatFile: :  output file format 
 *   -set: array contains values and styles to apply to template
 *   -export: boolean that indicates if return the content of the generated file
 *   -exportFormat:output file format for the export
*/
function exec(options) {
  // declare constant
  const _docFormat="application/vnd.google-apps.document";
  const _spreadsheetFormat="application/vnd.google-apps.spreadsheet";
  //
  try {
    // protects from "null" options
    var options=options || {};
    //
    // get template file by name
    var template = DriveApp.getFilesByName(options.templateName);
    //
    // if the file hasn't been found, returns error
    if(!template.hasNext())
      return {id:null, err: "Template file hasn't been found"};
    //
    // gets template file object
    template=template.next();
    //
    // determines template file format (only a documents and spreadsheets are supported)
    var fileFormat=template.getMimeType()
    //
    if(fileFormat!==_docFormat) 
      return {id: null, err: "Template file format is not supported"};
    //
    // create the copy file
    var newFile=createOutPutFile(options.filePath, template);
    //
    var newFileID=newFile.getId();
    //
    // gets the document object
    var doc=DocumentApp.openById(newFileID);
    //
    // replace values and set style
    for(var i=0;i<options.set.length;i++) {
      var error=generateElements(options.set[i],doc);      
      //
      if(error)
        return {id:null, err: error};
    }
    //
    return {id:newFileID};
  }
  catch(ex) {
    return {id:null, err: ex};
  };
}


/**
 * Creates the output file: a copy from template 
 * @param {string} path
 * @param {File} template
*/
function createOutPutFile(path,template) {
  //  gets array of folders name, after removing slashes and trim 
  foldersName = path.replace(/^\/*|\/*$/g, '').split("/");
  //
  // start with the main folder
  var folder = DriveApp.getRootFolder();
  //
  for(var i=0;i<foldersName.length-1;i++) {
    var currentFolderMame=foldersName[i];
    search = folder.getFoldersByName(currentFolderMame);
    //                
    // if folder in current level does not exit, create it
    folder = search.hasNext() ? search.next() : folder.createFolder(currentFolderMame); 
  }    
  //
  // return file copy
  return template.makeCopy(foldersName[foldersName.length-1],folder);
}


/**
 * Generates the new document elements and replaces values
 * @param {Object} set
 * @param {Object} doc
*/
function generateElements(set,doc) {
  try {
    // get document's body
    var body=doc.getBody();
    //
    // determine set type
    var keys=Object.keys(set);
    //
    // check if is a set for a repeated area
    if(Array.isArray(set[keys[0]])) {
      //
      // find tags start and end point
      var startElement=body.findText("{"+keys[0]+"}") ? body.findText("{"+keys[0]+"}").getElement() : null;
      var endElement=body.findText("{/"+keys[0]+"}") ? body.findText("{/"+keys[0]+"}").getElement() : null;
      //
      // build a new "range" that contains the "template" elements  
      var rangeBuilder = doc.newRange();
      rangeBuilder.addElementsBetween(startElement,0,endElement,0);
      //
      var range = rangeBuilder.build();
      //
      var rangeElements=range.getRangeElements();
      //
      var templateElements=[];
      //
      // get the range elements excluding the ends point
      for(var i=1;i<rangeElements.length-1;i++) 
        templateElements.push(rangeElements[i].getElement());
      //
      var tableRows=[];
      var elementRow=[];
      //
      // aggregate the template elements in one object
      for(var i=0;i<templateElements.length;i++) {
        //var templateElement=templateElements[i].getElement();
        //
        if(templateElements[i].getType() === DocumentApp.ElementType.TABLE) {
          for(var k=0;k<templateElements[i].getNumRows();k++) 
            tableRows.push(templateElements[i].getRow(k).copy());
        }
        //
        // remove the templare element
        templateElements[i].removeFromParent();
      }
      //
      // if the element on bottom of the tag is table, i create new table
      var upElement=startElement.getParent().getPreviousSibling();
      //
      if(upElement && upElement.getType() == DocumentApp.ElementType.TABLE) {
        if(tableRows.length) {
          for(var i=0;i<set[keys[0]].length;i++) {
            //
            for(var j=0;j<tableRows.length;j++) {
              var newRow=upElement.appendTableRow(tableRows[j].copy());
              //
              // if the rows set is Array
              if(Array.isArray(set[keys[0]][i])) {
                for(var k=0;k<set[keys[0]][i].length;k++) 
                  replaceValues(set[keys[0]][i][k],newRow);
              }
              else 
                replaceValues(set[keys[0]][i],newRow);
            }
          }
        }
      }
      else { // in case of list item appends new list item
        if(templateElements[0].getType() == DocumentApp.ElementType.LIST_ITEM) {
          upElement=startElement.getParent()
          //
          // get the position where append the list items
          var index = body.getChildIndex(upElement)
          //
          for(var i=set[keys[0]].length-1;i>=0;i--) {
            var newListItem= doc.getBody().insertListItem(index,templateElements[0].copy());
            //
            // if the rows set is Array
            if(Array.isArray(set[keys[0]][i])) {
              for(var k=0;k<set[keys[0]][i].length;k++) 
                replaceValues(set[keys[0]][i][k],newListItem);
            }
            else 
              replaceValues(set[keys[0]][i],newListItem);
          }
        }
      }
      //
      // remove the tags from document
      startElement.removeFromParent();
      endElement.removeFromParent();
    }
    else  
      replaceValues(set,body);
  }
  catch(ex) {
    return {id:null, err: ex};
  }
}


/**
 * Do the operations for a replace text and style of the targets 
 * @param {Object} set
 * @param {Object} element
*/
function replaceValues(set,element) {
  // if the target is a image call specific method
  if(set["img"]) {
    replaceImage(element,set);
  } 
  else if(set["target"] && (set["value"] || set["style"])) {  // if the set is "target" type ( {target:<name> value:<value> style:<obj>} ) call the reserved method
    //
      // if there is a style object,apply the style
       if(set["style"]) 
        applyStyle(element,set);
      //
      // if there is a replace value, replace the text
      if(set["value"])
        replaceTextForTarget(element,set);
  }
  else  // otherwise call the method for key / value set ( {<key1>:<value1> , <key2>:<value2,.......})
     replaceTextForKeys(element,set);
}


/**
 * Do the operations for change the style of the targets 
 * @param {Object} set
 * @param {Object} element
*/
function applyStyle(element,set) {
  // if the element is a "body", gets all target's elements in document
  if(element.getType()===DocumentApp.ElementType.BODY_SECTION) {
    var elements=getTargetElements(element,set["target"]); 
    //
    // for each target element replace the value
    for(var i=0;i<elements.length;i++) {
      var parent=elements[i].getParent().getParent();
      //
      // if target elment is in a table cell, apply style on her
      if(parent.getType()===DocumentApp.ElementType.TABLE_CELL)
        elements[i]=parent;
      //
      style(elements[i],set);
    }
  }
  else 
    style(element,set);
}


/**
 * Set style of element
 * @param {Object} element
 * @param {Object} set
*/
function style(element,set) {
  try {
    var elementType=element.getType();
    var table,cellText,cellRange;
    //
    // if the element is a Table row, it must apply the style for a single cell
    if(elementType===DocumentApp.ElementType.TABLE_ROW) {
      table=element.getParent();
      var cellRange=element.findText("{"+set["target"]+"}");
      //
      if(cellRange) 
        element=cellRange.getElement().getParent().getParent();      
      else // if the target is not found, exit from method
        return;
    }
    //
    // handel display:none
    if(set.style["display"] && set.style["display"]==="none") {
      element.removeFromParent();
      return;
    }
    var style={};
    var _style = {};
    //
    // set style properties
    style[DocumentApp.Attribute.FOREGROUND_COLOR] = set.style["color"];
    style[DocumentApp.Attribute.BACKGROUND_COLOR] = set.style["background-color"];
    style[DocumentApp.Attribute.FONT_FAMILY] = set.style["font-family"];
    style[DocumentApp.Attribute.FONT_SIZE] = set.style["font-size"];
    style[DocumentApp.Attribute.HEADING] = set.style["heading"];
    style[DocumentApp.Attribute.WIDTH] = set.style["width"];
    //
    // handle padding
    style[DocumentApp.Attribute.PADDING_BOTTOM] = set.style["padding-bottom"];
    style[DocumentApp.Attribute.PADDING_LEFT] = set.style["padding-left"];
    style[DocumentApp.Attribute.PADDING_RIGHT] = set.style["padding-right"];
    //
    // handle font weight
    if(set.style["font-weight"]) 
      style[DocumentApp.Attribute.BOLD] = set.style["font-weight"]==="bold";
    //
    // handle text-align
    if(set.style["text-align"]) {
      var value;
      //
      switch(set.style["text-align"]) {
        case "center":
          value=DocumentApp.HorizontalAlignment.CENTER;
        break;
        //
        case "left":
          value=DocumentApp.HorizontalAlignment.LEFT;
        break;
        //
        case "right":
          value=DocumentApp.HorizontalAlignment.RIGHT;
        break;
        //
        case "center":
          value=DocumentApp.HorizontalAlignment.CENTER
        break;
        //
        case "justify":
          value=DocumentApp.HorizontalAlignment.JUSTIFY;
        break;
      }
      _style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]=value;
      var paragraphElement=element;
      //
      if(element.getType()!== DocumentApp.ElementType.LIST_ITEM)
        paragraphElement=cellText ? cellText.getElement().getParent() : element.getParent();
      paragraphElement.setAttributes(_style);
    }
    //
    // handle font-style
    if(set.style["font-style"]) {
      if(set.style["font-style"]==="italic")
        style[DocumentApp.Attribute.ITALIC] = true;
      else if(set.style["font-style"]==="line-through")
        style[DocumentApp.Attribute.STRIKETHROUGH] = true;
      else if(set.style["font-style"]==="underline")
        style[DocumentApp.Attribute.UNDERLINE] = true;
    }
    //
    // set style attributes
    element.setAttributes(style);
  }
  catch(ex) {
    return {id:null, err: ex};
  }
}


/**
 * Replaces in element all key / value pairs of the set
 * @param {Object} element
 * @param {Object} set
*/
function replaceTextForKeys(element,set) {
  var keys=Object.keys(set);
  //
  for(var i=0;i<keys.length;i++)  
    replace(element,keys[i],set[keys[i]]);
}


/**
 * Replace text for a specific target
 * @param {Object} element
 * @param {Object} set
*/
function replaceTextForTarget(element,set) {
  // if the element is a "body", gets all target's elements in document
  if(element.getType()===DocumentApp.ElementType.BODY_SECTION) {
      var elements=getTargetElements(element,set["target"]);  
      //
      // for each target element replace the value
      for(var i=0;i<elements.length;i++)
        replace(elements[i],set["target"],set["value"]);
  }
  else
    replace(element,set["target"],set["value"]);
}

  
/**
 * Replace text for a specific target
 * @param {Object} element
 * @param {Object} set
*/
function replaceImage(element,set) {
  try {
    var elements=[element];
    //
    // if the element is a "body", gets all target's elements in document
    if(element.getType()===DocumentApp.ElementType.BODY_SECTION) 
      elements=getTargetElements(element,set["target"]);  
    //
    for(var i=0;i<elements.length;i++) {
      var startElement=elements[i].findText("{"+set.target+"}") ? element.findText("{"+set.target+"}").getElement() : null;
      //
      // if the target is not found in the current element, skipt to the next
      if(!startElement)
        continue;
      //
      // get element sibling
      var sibling=startElement.getPreviousSibling();
      //
      // get parent of element
      var paragraph=startElement.getParent();
      //
      // if the parent is a paragraph and there is a replace image, append the image
      if(paragraph.getType()===DocumentApp.ElementType.PARAGRAPH && set["value"]) 
        var newImage=paragraph.appendInlineImage(set["value"]);
      //
      // before apply the style select the correct element 
      sibling= newImage || sibling;
      if(sibling.getType()===DocumentApp.ElementType.INLINE_IMAGE && set["style"]) 
        style(sibling,set);
      //
      // remove the tags from document
      startElement.removeFromParent();
    }
  }
  catch(ex) {
    return {id:null, err: ex};
  }
}

  

/**
 * Replace text of element
 * @param {Object} element
 * @param {String} target
 * @param {String} newValue
*/
function replace(element,target,newValue) {
  // replaces all "|" to escape the character (reserved in Regular Expression)
  target=target.replace(/\|/g,"\\|");
  //
  // if the element is a "body" replace the value through a specific method
  if(element.getType()===DocumentApp.ElementType.BODY_SECTION) 
    element.replaceText("{"+target+"}",newValue);
  else
    element.editAsText().replaceText("{"+target+"}",newValue);
}


/**
 * Get target's elements 
 * @param {Object} body
 * @param {String} target
*/
function getTargetElements(body,target) {
  // find the positions
  var elements=[];
  var range=body.findText("{"+target +"}");
  //
  // find all occurency
  while(range) {
    elements.push(range.getElement());
    range=body.findText("{"+target +"}",range);
  }
  return elements;
}
