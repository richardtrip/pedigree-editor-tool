/**
 * Created by soheil on 27/07/2016.
 */

$services = {

	localization:{
		//This list is generated from original Phenotips source code content
		//phenotips/components/widgets/api/src/main/resources/ApplicationResources.properties
		messages: {
			"phenotips.imageDisplayer.delete": "Delete",
			"phenotips.imageDisplayer.openImage": "Open {0}",
			"phenotips.imageDisplayer.acceptedFormats": "Accepted file formats:",
			"phenotips.imageDisplayer.uploadAndSelect": "Upload and select",
			"phenotips.imageDisplayer.uploadAndManage": "Upload and manage",
			"phenotips.imageDisplayer.AJAXnotSuportedMessage": "This feature works better in more advanced browsers (Mozilla Firefox 4.0+, Google Chrome). Please consider upgrading.",
			"phenotips.imageDisplayer.noneAvailable": "None available",
			"phenotips.imageDisplayer.error.invalidFile": "The selected file has an unsupported format.",
			"phenotips.imageDisplayer.error.general": "An error occurred while uploading the file.",
			"phenotips.imageDisplayer.error.abort": "The upload has been canceled by the user or the browser dropped the connection",
			"phenotips.imageDisplayer.error.size": "The selected file is too large. Please choose files under __maxSize__",
			"phenotips.imageDisplayer.done": "Done",
			"phenotips.imageDisplayer.noFiles": "No files available",
			"phenotips.tableMacros.delete": "Delete",
			"phenotips.tableMacros.newEntry": "New entry",
			"phenotips.tableMacros.newVariantEntry": "Add variant",
			"phenotips.tableMacros.noObjects": "None specified",
			"phenotips.tableMacros.rowDeleteConfirmation": "Are you sure you want to delete this row?",
			"phenotips.tableMacros.listNotFound": "Cannot find the list to update",
			"phenotips.tableMacros.typeNotFound": "Unable to add data of that type",
			"phenotips.tableMacros.variantAlreadyExist": "This variant has already been entered",
			"phenotips.widgets.helpButtons.xHelpButton.hint": "How to enter this information",
			"phenotips.widgets.helpButtons.phenotype.hint": "About this phenotype",
			"phenotips.widgets.helpButtons.phenotype.synonym": "Also known as",
			"phenotips.widgets.helpButtons.phenotype.typeOf": "Is a type of",
			"phenotips.widgets.helpButtons.phenotype.browseRelated": "Browse related terms...",
			"phenotips.widgets.helpButtons.phenotypeQualifier.hint": "About this phenotype qualifier",
			"phenotips.widgets.helpButtons.omimDisease.hint": "About this disease",
			"phenotips.widgets.helpButtons.omimDisease.symptoms": "This disorder is typically characterized by",
			"phenotips.widgets.helpButtons.omimDisease.notSymptoms": "This disorder does not typically cause",
			"phenotips.widgets.helpButtons.omimDisease.linkToOmim": "Read about it on OMIM.org...",
			"phenotips.widgets.helpButtons.gene.hint": "About this gene",
			"phenotips.widgets.helpButtons.gene.alias": "Aliases",
			"phenotips.widgets.helpButtons.gene.previousSymbols": "Previous symbols",
			"phenotips.widgets.helpButtons.gene.family": "Gene family",
			"phenotips.widgets.helpButtons.loading": "Loading...",
			"phenotips.widgets.helpButtons.failedToLoad": "Failed to retrieve information about __subject__",
			"phenotips.widgets.multiSuggest.clear.title": "Clear the list of selected suggestions",
			"phenotips.widgets.multiSuggest.clear": "Delete all",
			"phenotips.widgets.suggest.hideSuggestions": "hide suggestions",
			"phenotips.widgets.workgroupPicker.noResults": "Group not found",
			"phenotips.yesNoNAPicker.NA.title": "NA (irrelevant or unknown)",
			"phenotips.yesNoNAPicker.NA.unselectedTitle": "Unselect",
			"phenotips.yesNoNAPicker.yes.title": "YES (investigated and observed)",
			"phenotips.yesNoNAPicker.yes.unselectedTitle": "Select as present",
			"phenotips.yesNoNAPicker.yes.selectedTitle": "Unselect as present",
			"phenotips.yesNoNAPicker.no.title": "NO (investigated and NOT observed)",
			"phenotips.yesNoNAPicker.no.unselectedTitle": "Select as absent",
			"phenotips.yesNoNAPicker.no.selectedTitle": "Unselect as absent"
		},
		render: function (name) {
			var messgaeContent = this.messages[name];
			if(messgaeContent == undefined || messgaeContent == null){
				return "";
			}
			var arguments = arguments;
			for (var i = 1; i < arguments.length; i++) {
				var indexPointer = "{" + (i - 1).toString() + "}";
				if (messgaeContent.indexOf(indexPointer)) {
					messgaeContent = messgaeContent.replace(indexPointer, arguments[i]);
				}
			}
			return messgaeContent;
		}
	}
};