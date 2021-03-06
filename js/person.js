/**
 * Person is a class representing any AbstractPerson that has sufficient information to be
 * displayed on the final pedigree graph (printed or exported). Person objects
 * contain information about disorders, age and other relevant properties, as well
 * as graphical data to visualize this information.
 *
 * @class Person
 * @constructor
 * @extends AbstractPerson
 * @param {Number} x X coordinate on the Raphael canvas at which the node drawing will be centered
 * @param {Number} y Y coordinate on the Raphael canvas at which the node drawing will be centered
 * @param {String} gender 'M', 'F' or 'U' depending on the gender
 * @param {Number} id Unique ID number
 * @param {Boolean} isProband True if this person is the proband
 */
var Person = Class.create(AbstractPerson, {

	initialize: function ($super, x, y, id, properties) {
		//var timer = new Helpers.Timer();
		this._isProband = (id == 0);
		!this._type && (this._type = "Person");
		this._setDefault();
		var gender = properties.hasOwnProperty("gender") ? properties['gender'] : "U";
		$super(x, y, gender, id);

		// need to assign after super() and explicitly pass gender to super()
		// because changing properties requires a redraw, which relies on gender
		// shapes being there already
		this.assignProperties(properties);
		//timer.printSinceLast("=== new person runtime: ");
	},

	_setDefault: function () {
		this._phenotipsId = "";

		Person.setMethods["sex"] = "setGender";
		Person.setMethods["gender"] = "setGender";

		this._firstName = "";
		Person.setMethods["firstName"] = "setFirstName";
		this._lastName = "";
		Person.setMethods["lastName"] = "setLastName";
		this._NHSNumber = ""; // added for GEL
		Person.setMethods["NHSNumber"] = "setNHSNumber";
		this._CHINumber = ""; // added for GEL
		Person.setMethods["CHINumber"] = "setCHINumber";
		this._gelSuperFamilyId = "";// added for GEL
		Person.setMethods["gelSuperFamilyId"] = "setGelSuperFamilyId";


		this._familyId = "";// added for GEL
		Person.setMethods["familyId"] = "setFamilyId";



		this._consanguineousPopulation = "";// added for GEL
		Person.setMethods["consanguineousPopulation"] = "setConsanguineousPopulation";
		this._karyotypicSex = "Unknown";// added for GEL
		Person.setMethods["karyotypicSex"] = "setKaryotypicSex";
		this._ancestries = "";//added for GEL
		Person.setMethods["ancestries"] = "setAncestries";
		this._participantId = "";
		Person.setMethods["participantId"] = "setParticipantId";


		this._registered = "";
		Person.setMethods["registered"] = "setRegistered";


		this._lastNameAtBirth = "";
		Person.setMethods["lastNameAtBirth"] = "setLastNameAtBirth";
		this._birthDate = null;
		Person.setMethods["birthDate"] = "setBirthDate";
		this._deathDate = null;
		Person.setMethods["deathDate"] = "setDeathDate";

		this._ageOfDeath = "";
		Person.setMethods["ageOfDeath"] = "setAgeOfDeath";
		this._ageOfDeathFormat = "y"; // added for GEL
		Person.setMethods["ageOfDeathFormat"] = "setAgeOfDeathFormat";

		this._conceptionDate = "";

		this._gestationAge = "";
		Person.setMethods["gestationAge"] = "setGestationAge";
		this._adoptedStatus = "";
		Person.setMethods["adoptedStatus"] = "setAdoptedStatus";
		this._externalID = "";
		Person.setMethods["externalID"] = "setExternalID";
		this._lifeStatus = 'alive';
		Person.setMethods["lifeStatus"] = "setLifeStatus";
		this._childlessStatus = null;
		Person.setMethods["childlessStatus"] = "setChildlessStatus";
		this._childlessReason = "";
		Person.setMethods["childlessReason"] = "setChildlessReason";
		this._carrierStatus = "";
		Person.setMethods["carrierStatus"] = "setCarrierStatus";
		this._disorders = [];
		Person.setMethods["disorders"] = "setDisorders";
		//comment added by Soheil 04.08.2016 for GEL(GenomicsEngland)
		//_disordersFullDetails: this field will hold all disorders with full details that returned from OCService
		//it will help to find out disorderName,disorderType ie. OMIM, ICD10,....
		this._disordersFullDetails = [];
		Person.setMethods["disordersFullDetails"] = "setDisordersFullDetails";
		//comment added by Soheil 04.08.2016 for GEL(GenomicsEngland)
		//_disorderType: this field is used to monitor the value of the selected disorderType in the UI
		//we do not export it into the JSON
		this._disorderType = "";
		this._ageOfOnset = ""; //This field is used internally for assigning ageOfOnset to disorder rows
		this._hpoPresent = ""; //This field is used internally for assigning hpoPresent status to hpo rows
		this._familyId = "";

		this._cancers = {};
		Person.setMethods["cancers"] = "setCancers";
		this._hpo = [];
		Person.setMethods["hpoTerms"] = "setHPO";
		this._hpoFullDetails = [];
		Person.setMethods["hpoTermsFullDetails"] = "setHPOFullDetails";
		this._ethnicities = [];
		Person.setMethods["ethnicities"] = "setEthnicities";
		this._candidateGenes = [];
		Person.setMethods["candidateGenes"] = "setGenes";
		this._twinGroup = null;
		Person.setMethods["twinGroup"] = "setTwinGroup";
		this._monozygotic = false;
		Person.setMethods["monozygotic"] = "setMonozygotic";
		this._evaluated = false;
		Person.setMethods["evaluated"] = "setEvaluated";
		this._pedNumber = "";
		Person.setMethods["nodeNumber"] = "setPedNumber";
		this._lostContact = false;
		Person.setMethods["lostContact"] = "setLostContact";
	},

	/**
	 * Initializes the object responsible for creating graphics for this Person
	 *
	 * @method _generateGraphics
	 * @param {Number} x X coordinate on the Raphael canvas at which the node drawing will be centered
	 * @param {Number} y Y coordinate on the Raphael canvas at which the node drawing will be centered
	 * @return {PersonVisuals}
	 * @private
	 */
	_generateGraphics: function (x, y) {
		return new PersonVisuals(this, x, y);
	},

	/**
	 * Returns True if this node is the proband (i.e. the main patient)
	 *
	 * @method isProband
	 * @return {Boolean}
	 */
	isProband: function () {
		return this._isProband;
	},


	/**
	 * Returns the id of the PhenoTips patient represented by this node.
	 * Returns an empty string for nodes not assosiated with any PhenoTips patients.
	 *
	 * @method getPhenotipsPatientId
	 * @return {String}
	 */
	getPhenotipsPatientId: function () {
		return this._phenotipsId;
	},

	/**
	 * Replaces (or sets) the id of the PhenoTips patient represented by this node
	 * with the given id, and updates the label.
	 *
	 * No error checking for the validity of this id is done.
	 *
	 * @method setPhenotipsPatientId
	 * @param firstName
	 */
	setPhenotipsPatientId: function (phenotipsId) {
		this._phenotipsId = phenotipsId;
	},

	/**
	 * Returns the first name of this Person
	 *
	 * @method getFirstName
	 * @return {String}
	 */
	getFirstName: function () {
		return this._firstName;
	},

	// added for GEL
	getNHSNumber: function() {
		return this._NHSNumber;
	},

	// added for GEL
	getRegistered: function() {
		return this._registered;
	},

	isRegistered: function () {
		if(this._registered && this._registered == true){
			return true;
		}
		return false;
	},

	// added for GEL
	getGelSuperFamilyId: function() {
		return this._gelSuperFamilyId
	},

	// added for GEL
	getFamilyId: function() {
		return this._familyId
	},


	//added for GEL
	getConsanguineousPopulation: function(){
		return this._consanguineousPopulation;
	},

	getKaryotypicSex: function(){
		return this._karyotypicSex;
	},

	getAncestries: function(){
		return this._ancestries;
	},

	// added for GEL
	getCHINumber: function() {
		return this._CHINumber;
	},


	getParticipantId: function(){
		return this._participantId;
	},


	/**
	 * Replaces the first name of this Person with firstName, and displays the label
	 *
	 * @method setFirstName
	 * @param firstName
	 */
	setFirstName: function (firstName) {
		firstName && (firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1));
		this._firstName = firstName;
		this.getGraphics().updateNameLabel();
	},

	// added for GEL
	setNHSNumber: function(NHSNumber) {
		this._NHSNumber = NHSNumber;
		this.getGraphics().updateExternalIDLabel();
	},

	// added for GEL
	setRegistered: function(registered) {
		this._registered = registered;
	},


	// added for GEL
	setGelSuperFamilyId: function(gelSuperFamilyId) {
		this._gelSuperFamilyId = gelSuperFamilyId;
	},

	// added for GEL
	setFamilyId: function(familyId) {
		this._familyId = familyId;
		//if it is a proband, then fire "pedigree:update:topMenu" to update the text in top-menu
		if(this.isProband()) {
			var event = { "familyId": this._familyId, "participantId": this._participantId };
			document.fire("pedigree:update:topMenu", event);
		}
	},

	//added for GEL
	setConsanguineousPopulation: function(consanguineousPopulation){
		this._consanguineousPopulation = consanguineousPopulation;
	},

	// added for GEL
	setKaryotypicSex: function(karyotypicSex) {
		this._karyotypicSex = karyotypicSex;
	},

	// added for GEL
	setAncestries: function(ancestries) {
		this._ancestries = ancestries;
	},


	// added for GEL
	setCHINumber: function(CHINumber) {
		this._CHINumber = CHINumber;
		this.getGraphics().updateExternalIDLabel();
	},

	setParticipantId: function(participantId) {
		this._participantId = participantId;
		//if it is a proband, then fire "pedigree:update:topMenu" to update the text in top-menu
		if(this.isProband()) {
			var event = { "familyId": this._familyId, "participantId": this._participantId };
			document.fire("pedigree:update:topMenu", event);
		}
        this.getGraphics().updateExternalIDLabel();
	},


	/**
	 * Returns the last name of this Person
	 *
	 * @method getLastName
	 * @return {String}
	 */
	getLastName: function () {
		return this._lastName;
	},

	/**
	 * Replaces the last name of this Person with lastName, and displays the label
	 *
	 * @method setLastName
	 * @param lastName
	 */
	setLastName: function (lastName) {
		lastName && (lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1));
		this._lastName = lastName;
		this.getGraphics().updateNameLabel();
		return lastName;
	},

	/**
	 * Returns the externalID of this Person
	 *
	 * @method getExternalID
	 * @return {String}
	 */
	getExternalID: function () {
		return this._externalID;
	},

	/**
	 * Sets the user-visible node ID for this person
	 * ("I-1","I-2","I-3", "II-1", "II-2", etc.)
	 *
	 * @method setPedNumber
	 */
	setPedNumber: function (pedNumberString) {
		this._pedNumber = pedNumberString;
		this.getGraphics().updateNumberLabel();
	},

	/**
	 * Returns the user-visible node ID for this person, e.g. "I", "II", "III", "IV", etc.
	 *
	 * @method getPedNumber
	 * @return {String}
	 */
	getPedNumber: function () {
		return this._pedNumber;
	},

	/**
	 * Replaces the external ID of this Person with the given ID, and displays the label
	 *
	 * @method setExternalID
	 * @param externalID
	 */
	setExternalID: function (externalID) {
		this._externalID = externalID;
		//this.getGraphics().updateExternalIDLabel();
	},

	/**
	 * Returns the last name at birth of this Person
	 *
	 * @method getLastNameAtBirth
	 * @return {String}
	 */
	getLastNameAtBirth: function () {
		return this._lastNameAtBirth;
	},

	/**
	 * Replaces the last name at birth of this Person with the given name, and updates the label
	 *
	 * @method setLastNameAtBirth
	 * @param lastNameAtBirth
	 */
	setLastNameAtBirth: function (lastNameAtBirth) {
		lastNameAtBirth && (lastNameAtBirth = lastNameAtBirth.charAt(0).toUpperCase() + lastNameAtBirth.slice(1));
		this._lastNameAtBirth = lastNameAtBirth;
		this.getGraphics().updateNameLabel();
		return lastNameAtBirth;
	},

	/**
	 * Replaces free-form comments associated with the node and redraws the label
	 *
	 * @method setComments
	 * @param comment
	 */
	setComments: function ($super, comment) {
		if (comment != this.getComments()) {
			$super(comment);
			this.getGraphics().updateCommentsLabel();
		}
	},

	/**
	 * Sets the type of twin
	 *
	 * @method setMonozygotic
	 */
	setMonozygotic: function (monozygotic) {
		if (monozygotic == this._monozygotic) return;
		this._monozygotic = monozygotic;
	},

	/**
	 * Returns the documented evaluation status
	 *
	 * @method getEvaluated
	 * @return {Boolean}
	 */
	getEvaluated: function () {
		return this._evaluated;
	},

	/**
	 * Sets the documented evaluation status
	 *
	 * @method setEvaluated
	 */
	setEvaluated: function (evaluationStatus) {
		if (evaluationStatus == this._evaluated) return;
		this._evaluated = evaluationStatus;
		this.getGraphics().updateEvaluationLabel();
	},

	/**
	 * Returns the "in contact" status of this node.
	 * "False" means proband has lost contaxt with this individual
	 *
	 * @method getLostContact
	 * @return {Boolean}
	 */
	getLostContact: function () {
		return this._lostContact;
	},


	setAgeOfOnset: function(ageOfOnset){
		this._ageOfOnset = ageOfOnset;
	},
	getAgeOfOnset: function(ageOfOnset){
		return this._ageOfOnset;
	},
	/**
	 * Sets the "in contact" status of this node
	 *
	 * @method setLostContact
	 */
	setLostContact: function (lostContact) {
		if (lostContact == this._lostContact) return;
		this._lostContact = lostContact;
	},

	/**
	 * Returns the type of twin: monozygotic or not
	 * (always false for non-twins)
	 *
	 * @method getMonozygotic
	 * @return {Boolean}
	 */
	getMonozygotic: function () {
		return this._monozygotic;
	},

	/**
	 * Assigns this node to the given twin group
	 * (a twin group is all the twins from a given pregnancy)
	 *
	 * @method setTwinGroup
	 */
	setTwinGroup: function (groupId) {
		this._twinGroup = groupId;
	},

	/**
	 * Returns the status of this Person
	 *
	 * @method getLifeStatus
	 * @return {String} "alive", "deceased", "stillborn", "unborn", "aborted" or "miscarriage"
	 */
	getLifeStatus: function () {
		return this._lifeStatus;
	},

	/**
	 * Returns True if this node's status is not 'alive' or 'deceased'.
	 *
	 * @method isFetus
	 * @return {Boolean}
	 */
	isFetus: function () {
		return (this.getLifeStatus() != 'alive' && this.getLifeStatus() != 'deceased');
	},

	/**
	 * Returns True is status is 'unborn', 'stillborn', 'aborted', 'miscarriage', 'alive' or 'deceased'
	 *
	 * @method _isValidLifeStatus
	 * @param {String} status
	 * @returns {boolean}
	 * @private
	 */
	_isValidLifeStatus: function (status) {
		return (status == 'unborn' || status == 'stillborn'
			|| status == 'aborted' || status == 'miscarriage'
			|| status == 'alive' || status == 'deceased')
	},

	/**
	 * Changes the life status of this Person to newStatus
	 *
	 * @method setLifeStatus
	 * @param {String} newStatus "alive", "deceased", "stillborn", "unborn", "aborted" or "miscarriage"
	 */
	setLifeStatus: function (newStatus) {
		if (this._isValidLifeStatus(newStatus)) {
			var oldStatus = this._lifeStatus;

			this._lifeStatus = newStatus;

			(newStatus != 'deceased') && this.setDeathDate("");
			(newStatus == 'alive') && this.setGestationAge();
			this.getGraphics().updateSBLabel();

			if (this.isFetus()) {
				this.setBirthDate("");
				this.setAdopted("");
				this.setChildlessStatus(null);
			}

			//Added for GEL
			//if status is set to alive, then make ageOfDeath and ageOfDeathFormat blank
			if(newStatus == "alive"){
				this.setAgeOfDeath("");
				this.setAgeOfDeathFormat("y");
			}
			this.getGraphics().updateLifeStatusShapes(oldStatus);
			this.getGraphics().getHoverBox().regenerateHandles();
			this.getGraphics().getHoverBox().regenerateButtons();
		}
	},

	/**
	 * Returns the date of the conception date of this Person
	 *
	 * @method getConceptionDate
	 * @return {Date}
	 */
	getConceptionDate: function () {
		return this._conceptionDate;
	},

	/**
	 * Replaces the conception date with newDate
	 *
	 * @method setConceptionDate
	 * @param {Date} newDate Date of conception
	 */
	setConceptionDate: function (newDate) {
		this._conceptionDate = newDate ? (new Date(newDate)) : '';
		this.getGraphics().updateAgeLabel();
	},

	/**
	 * Returns the number of weeks since conception
	 *
	 * @method getGestationAge
	 * @return {Number}
	 */
	getGestationAge: function () {
		if (this.getLifeStatus() == 'unborn' && this.getConceptionDate()) {
			var oneWeek = 1000 * 60 * 60 * 24 * 7,
				lastDay = new Date();
			return Math.round((lastDay.getTime() - this.getConceptionDate().getTime()) / oneWeek)
		}
		else if (this.isFetus()) {
			return this._gestationAge;
		}
		else {
			return null;
		}
	},

	/**
	 * Updates the conception age of the Person given the number of weeks passed since conception
	 *
	 * @method setGestationAge
	 * @param {Number} numWeeks Greater than or equal to 0
	 */
	setGestationAge: function (numWeeks) {
		try {
			numWeeks = parseInt(numWeeks);
		} catch (err) {
			numWeeks = "";
		}
		if (numWeeks) {
			this._gestationAge = numWeeks;
			var daysAgo = numWeeks * 7,
				d = new Date();
			d.setDate(d.getDate() - daysAgo);
			this.setConceptionDate(d);
		}
		else {
			this._gestationAge = "";
			this.setConceptionDate(null);
		}
		this.getGraphics().updateAgeLabel();
	},

	/**
	 * Returns the the birth date of this Person
	 *
	 * @method getBirthDate
	 * @return {Date}
	 */
	getBirthDate: function () {
		return this._birthDate;
	},

	/**
	 * Replaces the birth date with newDate
	 *
	 * @method setBirthDate
	 * @param newDate Either a string or an object with "year" (mandatory), "month" (optional) and "day" (optional) fields.
	 *                Must be earlier date than deathDate and a later than conception date
	 */
	setBirthDate: function (newDate) {
		newDate = new PedigreeDate(newDate);  // parse input
		if (!newDate.isSet()) {
			newDate = null;
		}

		//if birthDate has value, then set both ageOfDeath and ageOfDeathFormat to null,
		//we either have ageOfDeath and ageOfDeathFormat OR date-of-birth and date-of-death
		if(newDate != null){
			this.setAgeOfDeath("");
			this.setAgeOfDeathFormat("y");
		}

		if (!newDate || !this.getDeathDate() || this.getDeathDate().canBeAfterDate(newDate)) {
			this._birthDate = newDate;
			this.getGraphics().updateAgeLabel();
		}
	},

	/**
	 * Returns the death date of this Person
	 *
	 * @method getDeathDate
	 * @return {Date}
	 */
	getDeathDate: function () {
		return this._deathDate;
	},


	getAgeOfDeath: function () {
		return this._ageOfDeath;
	},


	getAgeOfDeathFormat: function () {
		return this._ageOfDeathFormat;
	},

	/**
	 * Replaces the death date with deathDate
	 *
	 *
	 * @method setDeathDate
	 * @param {Date} deathDate Must be a later date than birthDate
	 */
	setDeathDate: function (deathDate) {
		deathDate = new PedigreeDate(deathDate);  // parse input
		if (!deathDate.isSet()) {
			deathDate = null;
		}
		//if deathDate has value, then set empty for ageOfDeath and ageOfDeathFormat
		//we either have ageOfDeath and ageOfDeathFormat OR date-of-birth and date-of-death
		if(deathDate != null){
			this.setAgeOfDeath("");
			this.setAgeOfDeathFormat("y");
		}

		// only set death date if it happens ot be after the birth date, or there is no birth or death date
		if (!deathDate || !this.getBirthDate() || deathDate.canBeAfterDate(this.getBirthDate())) {
			this._deathDate = deathDate;
			this._deathDate && (this.getLifeStatus() == 'alive') && this.setLifeStatus('deceased');
		}
		this.getGraphics().updateAgeLabel();
		return this.getDeathDate();
	},

	setAgeOfDeath: function(ageOfDeath){
		var wasSet = this._ageOfDeath || this._ageOfDeath.length;
		this._ageOfDeath = ageOfDeath + "";

		//if ageOfDeath has value, then set deathDate and birthDate to null and make life status 'deceased'
		//we either have ageOfDeath and ageOfDeathFormat OR date-of-birth and date-of-death
		if(this._ageOfDeath && this._ageOfDeath.length){
			this.setLifeStatus('deceased');
			this.setDeathDate(null);
			this.setBirthDate(null);

			//if ageOfDeath and ageOfDeathFormat both have value then create the text to display in the UI
			var text = 	ageOfDeath + " " + this._ageOfDeathFormat;
			this.getGraphics().updateAgeLabelForGELDirectly(text);
		}else if(wasSet){
            // if was set but now is empty, then make sure we wipe out the text
            this.getGraphics().updateAgeLabelForGELDirectly("");
		}
	},


	setAgeOfDeathFormat: function(ageOfDeathFormat){
		this._ageOfDeathFormat = ageOfDeathFormat;

		//if ageOfDeath and ageOfDeathFormat both have value then create the text to display in the UI
		if(this._ageOfDeathFormat && this._ageOfDeathFormat.length > 0 && this._ageOfDeath && this._ageOfDeath.length > 0){
			var text = 	this._ageOfDeath + " " + this._ageOfDeathFormat;
			this.getGraphics().updateAgeLabelForGELDirectly(text);
		}
	},


	_isValidCarrierStatus: function (status) {
		return (status == '' || status == 'carrier' || status == 'uncertain'
			|| status == 'affected' || status == 'presymptomatic');
	},

	/**
	 * Sets the global disorder carrier status for this Person
	 *
	 * @method setCarrier
	 * @param status One of {'', 'carrier', 'affected', 'presymptomatic', 'uncertain'}
	 */
	setCarrierStatus: function (status) {

		//Commented for GEL(GenomicsEngland)
		//var numDisorders = this.getDisorders().length;
		//Added for GEL(GenomicsEngland)
		//We set the status as affected, only if there is any GEL disorder, so we count just GEL disorders
		var numDisorders = 0;
		for(var i = 0;i < this._disordersFullDetails.length; i++){
			if(this._disordersFullDetails[i].valueAll.disorderType && this._disordersFullDetails[i].valueAll.disorderType == "GEL"){
				numDisorders = numDisorders + 1;
			}
		}

		//this condition happens when we assign a disorder and then call 'setCarrierStatus'
		//to update the status (if GEL disorder is assigned then make it affected, otherwise do not change it)
		if (status === undefined || status === null) {
			if (numDisorders > 0) {
				status = "affected";
				this.getGraphics().updateDisorderShapes();
				this._carrierStatus = status;
				this.getGraphics().updateCarrierGraphic();
				return;
			}
		}

		//if the user select 'affected' manually and we find that No GEL disorders added,
		//then ignore it and do not change the status to affected
		if(status == "affected" && numDisorders == 0){
			editor.getOkCancelDialogue().showCustomized("At least one 'GEL Disorder' should be added to make the node status 'Affected'.",
				"Genomics England", "Ok", function () {this.dialog.show();},
				null, null,
				null, null, true);
			return;
		}

		//if the user select 'uncertain' or 'unaffected' manually and we find that there are GEL disorders in the list,
		//then change the status to affected
		if(status != "affected" && numDisorders > 0 ){
			status = "affected";
			this.getGraphics().updateDisorderShapes();
		}


		if (!this._isValidCarrierStatus(status)) return;


		if (status != this._carrierStatus) {
			this._carrierStatus = status;
			this.getGraphics().updateCarrierGraphic();
		}
	},

	/**
	 * Returns the global disorder carrier status for this person.
	 *
	 * @method getCarrier
	 * @return {String} Dissorder carrier status
	 */
	getCarrierStatus: function () {
		return this._carrierStatus;
	},

	/**
	 * Returns the list of all colors associated with the node
	 * (e.g. all colors of all disorders and all colors of all the genes)
	 * @method getAllNodeColors
	 * @return {Array of Strings}
	 */
	getAllNodeColors: function () {
		var result = [];
		for (var i = 0; i < this.getDisorders().length; i++) {
			//commented by Soheil for GEL(GenomicsEngland) 01.10.2016
			//result.push(editor.getDisorderLegend().getObjectColor(this.getDisorders()[i]));
			//and added the following lines
			//We need to show color for just GEL disorders,
			//for other disorders types such as OMIM, IDC10 and SnomedCT we just use WHITE color .......................
			if(this._disordersFullDetails != undefined && this._disordersFullDetails[i].valueAll != undefined){
				if(this._disordersFullDetails[i].valueAll.disorderType == "GEL") {
					result.push(editor.getDisorderLegend().getObjectColor(this.getDisorders()[i]));
				}
			}
			//..........................................................................................................
		}
		for (var i = 0; i < this.getGenes().length; i++) {
			result.push(editor.getGeneLegend().getObjectColor(this.getGenes()[i]));
		}
		for (var cancer in this.getCancers()) {
			if (this.getCancers().hasOwnProperty(cancer)) {
				if (this.getCancers()[cancer].hasOwnProperty("affected") && this.getCancers()[cancer].affected) {
					result.push(editor.getCancerLegend().getObjectColor(cancer));
				}
			}
		}
		return result;
	},

	/**
	 * Returns a list of disorders of this person.
	 *
	 * @method getDisorders
	 * @return {Array} List of disorder IDs.
	 */
	getDisorders: function () {
		//console.log("Get disorders: " + Helpers.stringifyObject(this._disorders));
		return this._disorders;
	},

	//added for GEL.......
	getDisorderType: function() {
		return this._disorderType;
	},

	/**
	 * Returns a list of disorders of this person, with non-scrambled IDs
	 *
	 * @method getDisordersForExport
	 * @return {Array} List of human-readable versions of disorder IDs
	 */
	getDisordersForExport: function () {
		var exportDisorders = this._disorders.slice(0);
		return exportDisorders;
	},

	/**
	 * Adds disorder to the list of this node's disorders and updates the Legend.
	 *
	 * @method addDisorder
	 * @param {Disorder} disorder Disorder object or a free-text name string
	 */
	addDisorder: function (disorder) {
		if (typeof disorder != 'object') {
			disorder = editor.getDisorderLegend().getDisorder(disorder);
		}
		//if (!this.hasDisorder(disorder.getDisorderId())) {
			//disorder.valueAll passed for GEL
			editor.getDisorderLegend().addCase(disorder.getDisorderId(), disorder.getName(), disorder.getValueAll(), this.getID());
			this.getDisorders().push(disorder.getDisorderId());
			//this is added for GEL ...........................................................................
			//var alreadyExists = false;
			//for(var i = 0; i < this._disordersFullDetails.length;i++){
			//	if(this._disordersFullDetails[i].disorderId == disorder.getDisorderId()){
			//		alreadyExists = true;
			//	}
			//}
			//if(!alreadyExists) {
				this._disordersFullDetails.push(disorder);
			//}
			//.................................................................................................
		//}
		//else {
			//alert("This person already has the specified disorder");
		//}

		// if any "real" disorder has been added
		// the virtual "affected" disorder should be automatically removed
		if (this.getDisorders().length > 1) {
			this.removeDisorder("affected");
		}
	},

	/**
	 * Removes disorder from the list of this node's disorders and updates the Legend.
	 *
	 * @method removeDisorder
	 * @param {Number} disorderId id of the disorder to be removed
	 */
	removeDisorder: function (disorderId) {
		if (this.hasDisorder(disorderId)) {
			editor.getDisorderLegend().removeCase(disorderId, this.getID());
			this._disorders = this.getDisorders().without(disorderId);
			//added for GEL ................................................

			//...............................................................
		}

		for(var i = this._disordersFullDetails.length -1 ;i>=0; i--){
			if(this._disordersFullDetails[i].disorderId == disorderId){
				this._disordersFullDetails.splice(i, 1);

				//break;
			}
		}
		//else {
		//	if (disorderId != "affected") {
		//		alert("This person doesn't have the specified disorder");
		//	}
		//}
	},

	/**
	 * Sets the list of disorders of this person to the given list
	 *
	 * @method setDisorders
	 * @param {Array} disorders List of Disorder objects
	 */
	setDisorders: function (disorders) {
		//console.log("Set disorders: " + Helpers.stringifyObject(disorders));
		for (var i = this.getDisorders().length - 1; i >= 0; i--) {
			this.removeDisorder(this.getDisorders()[i]);
		}
		for (var i = 0; i < disorders.length; i++) {
			this.addDisorder(disorders[i]);
		}
		this.getGraphics().updateDisorderShapes();
		this.setCarrierStatus(); // update carrier status
	},
	//added for GEL................................................................................
	setDisorderType: function(disorderType) {
		this._disorderType = disorderType;
	},
	//.............................................................................................


	//added for GEL................................................................................
	setDisordersFullDetails: function(disordersFullDetails){
		this._disordersFullDetails = disordersFullDetails;
	},

	/**
	 * Returns a list of all HPO terms associated with the patient
	 *
	 * @method getHPO
	 * @return {Array} List of HPO IDs.
	 */
	getHPO: function () {
		return this._hpo;
	},

	/**
	 * Returns a list of phenotypes of this person, with non-scrambled IDs
	 *
	 * @method getHPOForExport
	 * @return {Array} List of human-readable versions of HPO IDs
	 */
	getHPOForExport: function () {
		var exportHPOs = this._hpo.slice(0);
		return exportHPOs;
	},

	/**
	 * Adds HPO term to the list of this node's phenotypes and updates the Legend.
	 *
	 * @method addHPO
	 * @param {HPOTerm} hpo HPOTerm object or a free-text name string
	 */
	addHPO: function (hpo) {
		if (typeof hpo != 'object') {
			hpo = editor.getHPOLegend().getTerm(hpo);
		}
		if (!this.hasHPO(hpo.getID())) {
			//hpo.valueAll passed for GEL
			editor.getHPOLegend().addCase(hpo.getID(), hpo.getName(), hpo.getValueAll(), this.getID());
			this.getHPO().push(hpo.getID());
			//this is added for GEL .......................................................................
			var alreadyExists = false;
			for(var i = 0; i < this._hpoFullDetails.length;i++){
				if(this._hpoFullDetails[i].hpoId == hpo){
					alreadyExists = true;
				}
			}
			if(!alreadyExists) {
				this._hpoFullDetails.push(hpo);
			}
			//.............................................................................................
		}
		else {
			alert("This person already has the specified phenotype");
		}
	},

	/**
	 * Removes HPO term from the list of this node's terms and updates the Legend.
	 *
	 * @method removeHPO
	 * @param {Number} hpoId id of the term to be removed
	 */
	removeHPO: function (hpoId) {
		if (this.hasHPO(hpoId)) {
			editor.getHPOLegend().removeCase(hpoId, this.getID());
			this._hpo = this.getHPO().without(hpoId);

			//added for GEL ................................................
			for(var i = 0;i < this._hpoFullDetails.length; i++){
				if(this._hpoFullDetails[i].hpoId == hpoId){
					this._hpoFullDetails.splice(i, 1);
					break;
				}
			}
			//...............................................................
		}
		else {
			alert("This person doesn't have the specified HPO term");
		}
	},

	/**
	 * Sets the list of HPO temrs of this person to the given list
	 *
	 * @method setHPO
	 * @param {Array} hpos List of HPOTerm objects
	 */
	setHPO: function (hpos) {
		for (var i = this.getHPO().length - 1; i >= 0; i--) {
			this.removeHPO(this.getHPO()[i]);
		}
		for (var i = 0; i < hpos.length; i++) {
			this.addHPO(hpos[i]);
		}
	},

	//added for GEL................................................................................
	setHPOFullDetails: function(hpoFullDetails) {
		this._hpoFullDetails = hpoFullDetails;
	},

	/**
	 * @method hasHPO
	 * @param {Number} id Term ID, taken from the HPO database
	 */
	hasHPO: function (id) {
		return (this.getHPO().indexOf(id) != -1);
	},

	/**
	 * Sets the list of ethnicities of this person to the given list
	 *
	 * @method setEthnicities
	 * @param {Array} ethnicities List of ethnicity names (as strings)
	 */
	setEthnicities: function (ethnicities) {
		this._ethnicities = ethnicities;
	},

	/**
	 * Returns a list of ethnicities of this person.
	 *
	 * @method getEthnicities
	 * @return {Array} List of ethnicity names.
	 */
	getEthnicities: function () {
		return this._ethnicities;
	},

	/**
	 * Adds gene to the list of this node's candidate genes
	 *
	 * @method addGenes
	 */
	addGene: function (gene) {
		if (this.getGenes().indexOf(gene) == -1) {
			editor.getGeneLegend().addCase(gene, gene, this.getID());
			this.getGenes().push(gene);
		}
	},

	/**
	 * Removes gene from the list of this node's candidate genes
	 *
	 * @method removeGene
	 */
	removeGene: function (gene) {
		if (this.getGenes().indexOf(gene) !== -1) {
			editor.getGeneLegend().removeCase(gene, this.getID());
			this._candidateGenes = this.getGenes().without(gene);
		}
	},

	/**
	 * Sets the list of candidate genes of this person to the given list
	 *
	 * @method setGenes
	 * @param {Array} genes List of gene names (as strings)
	 */
	setGenes: function (genes) {
		for (var i = this.getGenes().length - 1; i >= 0; i--) {
			this.removeGene(this.getGenes()[i]);
		}
		for (var i = 0; i < genes.length; i++) {
			this.addGene(genes[i]);
		}
		this.getGraphics().updateDisorderShapes();
	},

	/**
	 * Returns a list of candidate genes for this person.
	 *
	 * @method getGenes
	 * @return {Array} List of gene names.
	 */
	getGenes: function () {
		return this._candidateGenes;
	},

	/**
	 * Adds cancer to the list of this node's common cancers
	 *
	 * @param cancerName String
	 * @param cancerDetails Object {affected: Boolean, numericAgeAtDiagnosis: Number, ageAtDiagnosis: String, comments: String}
	 * @method addCancer
	 */
	addCancer: function (cancerName, cancerDetails) {
		if (!this.getCancers().hasOwnProperty(cancerName)) {
			if (cancerDetails.hasOwnProperty("affected") && cancerDetails.affected) {
				editor.getCancerLegend().addCase(cancerName, cancerName, this.getID());
			}
			this.getCancers()[cancerName] = cancerDetails;
		}
	},

	/**
	 * Removes cancer from the list of this node's common cancers
	 *
	 * @method removeCancer
	 */
	removeCancer: function (cancerName) {
		if (this.getCancers().hasOwnProperty(cancerName)) {
			editor.getCancerLegend().removeCase(cancerName, this.getID());
			delete this._cancers[cancerName];
		}
	},

	/**
	 * Sets the set of common cancers affecting this person to the given set
	 *
	 * @method setCancers
	 * @param {Object} { Name: {affected: Boolean, numericAgeAtDiagnosis: Number, ageAtDiagnosis: String, comments: String} }
	 */
	setCancers: function (cancers) {
		for (var cancerName in this.getCancers()) {
			if (this.getCancers().hasOwnProperty(cancerName)) {
				this.removeCancer(cancerName);
			}
		}
		for (var cancerName in cancers) {
			if (cancers.hasOwnProperty(cancerName)) {
				this.addCancer(cancerName, cancers[cancerName]);
			}
		}
		this.getGraphics().updateDisorderShapes();
		this.getGraphics().updateCancerAgeOfOnsetLabels();
	},

	/**
	 * Returns a list of common cancers affecting this person.
	 *
	 * @method getCancers
	 * @return {Object}  { Name: {affected: Boolean, numericAgeAtDiagnosis: Number, ageAtDiagnosis: String, comments: String} }
	 */
	getCancers: function () {
		return this._cancers;
	},

	/**
	 * Removes the node and its visuals.
	 *
	 * @method remove
	 * @param [skipConfirmation=false] {Boolean} if true, no confirmation box will pop up
	 */
	remove: function ($super) {
		this.setDisorders([]);  // remove disorders form the legend
		this.setHPO([]);
		this.setGenes([]);
		this.setCancers([]);
		$super();
	},

	/**
	 * Returns disorder with given id if this person has it. Returns null otherwise.
	 *
	 * @method getDisorderByID
	 * @param {Number} id Disorder ID, taken from the OMIM database
	 * @return {Disorder}
	 */
	hasDisorder: function (id) {
		return (this.getDisorders().indexOf(id) != -1);
	},

	/**
	 * Changes the childless status of this Person. Nullifies the status if the given status is not
	 * "childless" or "infertile". Modifies the status of the partnerships as well.
	 *
	 * @method setChildlessStatus
	 * @param {String} status Can be "childless", "infertile" or null
	 * @param {Boolean} ignoreOthers If True, changing the status will not modify partnerships's statuses or
	 * detach any children
	 */
	setChildlessStatus: function (status) {
		if (!this.isValidChildlessStatus(status))
			status = null;
		if (status != this.getChildlessStatus()) {
			this._childlessStatus = status;
			this.setChildlessReason(null);
			this.getGraphics().updateChildlessShapes();
			this.getGraphics().getHoverBox().regenerateHandles();
		}
		return this.getChildlessStatus();
	},

	/**
	 * Returns an object (to be accepted by node menu) with information about this Person
	 *
	 * @method getSummary
	 * @return {Object} Summary object for the menu
	 */
	getSummary: function () {
		var onceAlive = editor.getGraph().hasRelationships(this.getID());
		var inactiveStates = onceAlive ? ['unborn', 'aborted', 'miscarriage', 'stillborn'] : false;
		var disabledStates = false;

		if (this.isProband() || this.isRegistered()) {
			disabledStates = ['alive', 'deceased', 'unborn', 'aborted', 'miscarriage', 'stillborn']; // all possible
			Helpers.removeFirstOccurrenceByValue(disabledStates, this.getLifeStatus())
		}

		var disabledGenders = (this.isProband() || this.isRegistered()) ? [] : false;
		var inactiveGenders = false;
		var genderSet = editor.getGraph().getPossibleGenders(this.getID());
		for (gender in genderSet) {
			if (genderSet.hasOwnProperty(gender))
				if (!genderSet[gender]) {
					if (!inactiveGenders)
						inactiveGenders = [];
					inactiveGenders.push(gender);
				}
			if (this.isProband() && gender != this.getGender()) {
				disabledGenders.push(gender);
			}
		}

		var childlessInactive = this.isFetus();  // TODO: can a person which already has children become childless?
		// maybe: use editor.getGraph().hasNonPlaceholderNonAdoptedChildren() ?
		var disorders = [];
		this._disordersFullDetails.forEach(function (disorder) {
			//var disorderName = editor.getDisorderLegend().getDisorder(disorder).getName();
			//added for GEL, get disorderObject and push valueAll into the array ........................
			//var disorderObj  = editor.getDisorderLegend().getDisorder(disorder);
			disorders.push({id: disorder.disorderId, value: disorder.name, valueAll:disorder.valueAll});
			//............................................................................................
		});
		var hpoTerms = [];
		this.getHPO().forEach(function (hpo) {
			var termName = editor.getHPOLegend().getTerm(hpo).getName();
			//Added for GEL(GenomicsEngland) ................................................................
			var hpoObj  = editor.getHPOLegend().getTerm(hpo);
			hpoTerms.push({id: hpo, value: termName, valueAll:hpoObj.valueAll});
			//...............................................................................................
		});

		var cantChangeAdopted = this.isFetus() || editor.getGraph().hasToBeAdopted(this.getID());
		// a person which has relationships can't be adopted out - we wouldn't know details in that case
		if (!cantChangeAdopted && onceAlive) {
			cantChangeAdopted = ["adoptedOut", "disableViaOpacity"];
		}

		var inactiveMonozygothic = true;
		var disableMonozygothic = true;
		if (this._twinGroup !== null) {
			var twins = editor.getGraph().getAllTwinsSortedByOrder(this.getID());
			if (twins.length > 1) {
				// check that there are twins and that all twins
				// have the same gender, otherwise can't be monozygothic
				inactiveMonozygothic = false;
				disableMonozygothic = false;
				for (var i = 0; i < twins.length; i++) {
					if (editor.getGraph().getGender(twins[i]) != this.getGender()) {
						disableMonozygothic = true;
						break;
					}
				}
			}
		}

		var inactiveCarriers = [];
		//Commented for GEL(GenomicsEngland)
		//We don't need to inactivate any 'Disease Affection' radio button items in th UI
		//if (disorders.length > 0) {
		//	if (disorders.length != 1 || disorders[0].id != "affected") {
		//		inactiveCarriers = [''];
		//	}
		//}
		if (this.getLifeStatus() == "aborted" || this.getLifeStatus() == "miscarriage") {
			inactiveCarriers.push('presymptomatic');
		}
		//If it has participantId, then disable all options
		if(this.isRegistered()){
			inactiveCarriers = ['','carrier','uncertain','affected','presymptomatic'];
		}


		var inactiveLostContact = this.isProband() || !editor.getGraph().isRelatedToProband(this.getID()) || this.isRegistered();

		// TODO: only suggest posible birth dates which are after the latest
		//       birth date of any ancestors; only suggest death dates which are after birth date

		return {
			identifier: {value: this.getID()},
			nhs_number:    {value : this.getNHSNumber(), disabled: true},
			chi_number:    {value : this.getCHINumber(), disabled: true},
			gel_super_family_id: {value : this.getGelSuperFamilyId()},
			family_id: {value : this.getFamilyId()},
			consanguineous_population: {value : this.getConsanguineousPopulation()},
			karyotypic_sex: {value : this.getKaryotypicSex()},
			ancestries: {value : this.getAncestries()},
			participant_id:{value : this.getParticipantId(), disabled: true},
			registered:{value : this.getRegistered()},

			first_name: {value: this.getFirstName(), disabled: true},
			last_name: {value: this.getLastName(), disabled: true},
			last_name_birth: {value: this.getLastNameAtBirth(), disabled: this.isRegistered()}, //, inactive: (this.getGender() != 'F')},
			external_id: {value: this.getExternalID(), disabled: this.isRegistered()},
			gender: {value: this.getGender(), inactive: inactiveGenders, disabled: this.isRegistered()},
			date_of_birth: {value: this.getBirthDate(), inactive: this.isFetus(), disabled: this.isRegistered()},
			carrier: {value: this.getCarrierStatus(), disabled: inactiveCarriers},
			disorders: {value: disorders, disabled: this.isRegistered()},
			disordersFullDetails:     {value : this._disordersFullDetails},
			disorderType:  {value : this.getDisorderType(), disabled: this.isRegistered()},
			ethnicity: {value: this.getEthnicities(), disabled: this.isRegistered() },
			candidate_genes: {value: this.getGenes(), disabled: this.isRegistered()},
			adopted: {value: this.getAdopted(), inactive: cantChangeAdopted, disabled: this.isRegistered()},
			state: {value: this.getLifeStatus(), inactive: inactiveStates, disabled: disabledStates },
			date_of_death: {value: this.getDeathDate(), inactive: this.isFetus(), disabled: this.isRegistered()},

			age_of_death: {value: this.getAgeOfDeath(), inactive: this.isFetus(), disabled: this.isRegistered() || (this.getBirthDate() != null && this.getDeathDate()!=null)},
			age_of_death_format: {value: this.getAgeOfDeathFormat(), inactive: this.isFetus(), disabled: this.isRegistered() || (this.getBirthDate() != null && this.getDeathDate()!=null) },

			commentsClinical: {value: this.getComments(), inactive: false},
			commentsPersonal: {value: this.getComments(), inactive: false},  // so far the same set of comments is displayed on all tabs
			commentsCancers: {value: this.getComments(), inactive: false},
			gestation_age: {value: this.getGestationAge(), inactive: !this.isFetus(), disabled: this.isRegistered()},
			childlessSelect: {value: this.getChildlessStatus() ? this.getChildlessStatus() : 'none', inactive: childlessInactive, disabled: this.isRegistered()},
			childlessText: {value: this.getChildlessReason() ? this.getChildlessReason() : undefined, inactive: childlessInactive, disabled: !this.getChildlessStatus() || this.isRegistered()},
			placeholder: {value: false, inactive: true },
			monozygotic: {value: this.getMonozygotic(), inactive: inactiveMonozygothic, disabled: disableMonozygothic || this.isRegistered()},
			evaluated: {value: this.getEvaluated(), disabled: this.isRegistered() },
			hpo_positive: {value: hpoTerms , disabled: this.isRegistered()},
			hpo_positiveFullDetails:     {value : this._hpoFullDetails}, //Added for GEL(GenomicsEngland)..........
			nocontact: {value: this.getLostContact(), inactive: inactiveLostContact },
			cancers: {value: this.getCancers() , disabled: this.isRegistered()},
			phenotipsid: {value: this.getPhenotipsPatientId() , disabled: this.isRegistered()},

			//These two fields are used internally for creating rows in disorder and hpo, we do not export them
			ageOfOnset: {value: this.getAgeOfOnset() , disabled: this.isRegistered()},
			hpoPresent: {value: "" , disabled: this.isRegistered()},
			//"age_of_death_guide" this is a label field (added in pedigree.js as a label in Personal tab)
			//which is a guidance for ageOfDeath and should be hidden when node is not Alive or not Death
			//This is just for display purpose
			age_of_death_guide:{value:"", inactive: this.isFetus()}
		}
	},

	/**
	 * Returns an object containing all the properties of this node
	 * except id, x, y & type
	 *
	 * @method getProperties
	 * @return {Object} in the form
	 *
	 {
	   property: value
	 }
	 */
	getProperties: function ($super) {
		// note: properties equivalent to default are not set
		var info = $super();
		if (this.getPhenotipsPatientId() != "")
			info['phenotipsId'] = this.getPhenotipsPatientId();
		if (this.getFirstName() != "")
			info['fName'] = this.getFirstName();
		if (this.getLastName() != "")
			info['lName'] = this.getLastName();
		if (this.getNHSNumber() != "")
			info['NHSNumber'] = this.getNHSNumber();
		if (this.getGelSuperFamilyId() != "")
			info['gelSuperFamilyId'] = this.getGelSuperFamilyId();

		if (this.getFamilyId() != "")
			info['familyId'] = this.getFamilyId();

		if (this.getKaryotypicSex() != "")
			info['karyotypicSex'] = this.getKaryotypicSex();
		if (this.getConsanguineousPopulation() != "")
			info['consanguineousPopulation'] = this.getConsanguineousPopulation();
		if (this.getAncestries() != "")
			info['ancestries'] = this.getAncestries();
		if (this.getCHINumber() != "")
			info['CHINumber'] = this.getCHINumber();
		if (this.getParticipantId() != "")
			info['participantId'] = this.getParticipantId();


		if (this.getRegistered() != "")
			info['registered'] = this.getRegistered();


		if (this.getLastNameAtBirth() != "")
			info['lNameAtB'] = this.getLastNameAtBirth();
		if (this.getExternalID() != "")
			info['externalID'] = this.getExternalID();
		if (this.getBirthDate() != null)
			info['dob'] = this.getBirthDate().getSimpleObject();
		if (this.getAdopted() != "")
			info['adoptedStatus'] = this.getAdopted();
		if (this.getLifeStatus() != 'alive')
			info['lifeStatus'] = this.getLifeStatus();
		if (this.getDeathDate() != null)
			info['dod'] = this.getDeathDate().getSimpleObject();


		if (this.getAgeOfDeath() != "")
			info['ageOfDeath'] = this.getAgeOfDeath();

		if (this.getAgeOfDeathFormat() != "")
			info['ageOfDeathFormat'] = this.getAgeOfDeathFormat();


		if (this.getGestationAge() != null)
			info['gestationAge'] = this.getGestationAge();
		if (this.getChildlessStatus() != null) {
			info['childlessStatus'] = this.getChildlessStatus();
			info['childlessReason'] = this.getChildlessReason();
		}
		if (this.getDisorders().length > 0)
			info['disorders'] = this.getDisordersForExport();

		if (this._disordersFullDetails.length > 0)
			info['disordersFullDetails'] = this._disordersFullDetails;


		if (!Helpers.isObjectEmpty(this.getCancers()))
			info['cancers'] = this.getCancers();
		if (this.getHPO().length > 0)
			info['hpoTerms'] = this.getHPOForExport();
		//Added for GEL(GenomicsEngland) ............................................................
		if (this._hpoFullDetails.length > 0)
			info['hpoTermsFullDetails'] = this._hpoFullDetails;
		//...........................................................................................

		if (this.getEthnicities().length > 0)
			info['ethnicities'] = this.getEthnicities();
		if (this.getGenes().length > 0)
			info['candidateGenes'] = this.getGenes();
		if (this._twinGroup !== null)
			info['twinGroup'] = this._twinGroup;
		if (this._monozygotic)
			info['monozygotic'] = this._monozygotic;
		if (this._evaluated)
			info['evaluated'] = this._evaluated;
		if (this._carrierStatus)
			info['carrierStatus'] = this._carrierStatus;
		if (this.getLostContact())
			info['lostContact'] = this.getLostContact();
		if (this.getPedNumber() != "")
			info['nodeNumber'] = this.getPedNumber();
		return info;
	},

	/**
	 * Applies the properties found in info to this node.
	 *
	 * @method assignProperties
	 * @param properties Object
	 * @return {Boolean} True if info was successfully assigned
	 */
	assignProperties: function ($super, info) {
		this._setDefault();

		if ($super(info)) {
			if (info.phenotipsId && this.getPhenotipsPatientId() != info.phenotipsId) {
				this.setPhenotipsPatientId(info.phenotipsId);
			}
			if (info.fName && this.getFirstName() != info.fName) {
				this.setFirstName(info.fName);
			}
			if (info.lName && this.getLastName() != info.lName) {
				this.setLastName(info.lName);
			}
			if (info.participantId && this.getParticipantId() != info.participantId) {
				this.setParticipantId(info.participantId);
			}


			if (info.registered && this.getRegistered() != info.registered) {
				this.setRegistered(info.registered);
			}


			if(info.NHSNumber && this.getNHSNumber() != info.NHSNumber) {
				this.setNHSNumber(info.NHSNumber);
			}
			if(info.gelSuperFamilyId && this.getGelSuperFamilyId() != info.gelSuperFamilyId) {
				this.setGelSuperFamilyId(info.gelSuperFamilyId);
			}

			if(info.familyId && this.getFamilyId() != info.familyId) {
				this.setFamilyId(info.familyId);
			}

			if(info.karyotypicSex && this.getKaryotypicSex() != info.karyotypicSex) {
				this.setKaryotypicSex(info.karyotypicSex);
			}
			if(info.consanguineousPopulation && this.getConsanguineousPopulation() != info.consanguineousPopulation) {
				this.setConsanguineousPopulation(info.consanguineousPopulation);
			}
			if(info.ancestries && this.getAncestries() != info.ancestries) {
				this.setAncestries(info.ancestries);
			}
			if(info.CHINumber && this.getCHINumber() != info.CHINumber) {
				this.setCHINumber(info.CHINumber);
			}
			if (info.lNameAtB && this.getLastNameAtBirth() != info.lNameAtB) {
				this.setLastNameAtBirth(info.lNameAtB);
			}
			if (info.externalID && this.getExternalID() != info.externalID) {
				this.setExternalID(info.externalID);
			}
			if (info.dob && this.getBirthDate() != info.dob) {
				this.setBirthDate(info.dob);
			}

			//then load disorders
			if (info.disorders) {
				var disorders = [];
				//if we have disordersFullDetails, then complete the disorders objects based on that
				if (info.disordersFullDetails != undefined && info.disordersFullDetails.length > 0) {
					for (var i = 0; i < info.disordersFullDetails.length; i++) {
						var disorder = new Disorder(info.disordersFullDetails[i].disorderId,info.disordersFullDetails[i].name,info.disordersFullDetails[i].ageOfOnset,info.disordersFullDetails[i].disorderType,info.disordersFullDetails[i].valueAll);
						disorders.push(disorder);
					}
					this.setDisorders(disorders);
				}else{
					this.setDisorders(info.disorders);
				}
			}

			if (info.cancers) {
				this.setCancers(info.cancers);
			}

			if(info.hpoTermsFullDetails) {
				this._hpoTermsFullDetails = info.hpoTermsFullDetails.slice();

				for(var i = 0;i<this._hpoTermsFullDetails.length;i++){
					if(!this._hpoTermsFullDetails[i].valueAll){
						this._hpoTermsFullDetails[i].valueAll = {};
					}
				}
			}

			if (info.hpoTerms) {
				var terms = [];
				//if we have hpoTermsFullDetails, then complete the hpoTerms objects based on that
				if (this._hpoTermsFullDetails != undefined && this._hpoTermsFullDetails.length > 0) {
					for (var i = 0; i < this._hpoTermsFullDetails.length; i++) {
						var term = new HPOTerm(this._hpoTermsFullDetails[i].hpoId,this._hpoTermsFullDetails[i].name,this._hpoTermsFullDetails[i].hpoPresent,this._hpoTermsFullDetails[i].valueAll);
						terms.push(term);
					}
					this.setHPO(terms);
				}else{
					this.setHPO(info.hpoTerms);
				}
			}
			if (info.ethnicities) {
				this.setEthnicities(info.ethnicities);
			}
			if (info.candidateGenes) {
				this.setGenes(info.candidateGenes);
			}
			if (info.hasOwnProperty("adoptedStatus") && this.getAdopted() != info.adoptedStatus) {
				this.setAdopted(info.adoptedStatus);
			}
			if (info.hasOwnProperty("lifeStatus") && this.getLifeStatus() != info.lifeStatus) {
				this.setLifeStatus(info.lifeStatus);
			}
			if (info.dod && this.getDeathDate() != info.dod) {
				this.setDeathDate(info.dod);
			}

			if (info.ageOfDeath && this.getAgeOfDeath() != info.ageOfDeath) {
				this.setAgeOfDeath(info.ageOfDeath);
			}

			if (info.ageOfDeathFormat && this.getAgeOfDeathFormat() != info.ageOfDeathFormat) {
				this.setAgeOfDeathFormat(info.ageOfDeathFormat);
			}


			if (info.gestationAge && this.getGestationAge() != info.gestationAge) {
				this.setGestationAge(info.gestationAge);
			}
			if (info.childlessStatus && this.getChildlessStatus() != info.childlessStatus) {
				this.setChildlessStatus(info.childlessStatus);
			}
			if (info.childlessReason && this.getChildlessReason() != info.childlessReason) {
				this.setChildlessReason(info.childlessReason);
			}
			if (info.hasOwnProperty("twinGroup") && this._twinGroup != info.twinGroup) {
				this.setTwinGroup(info.twinGroup);
			}
			if (info.hasOwnProperty("monozygotic") && this._monozygotic != info.monozygotic) {
				this.setMonozygotic(info.monozygotic);
			}
			if (info.hasOwnProperty("evaluated") && this._evaluated != info.evaluated) {
				this.setEvaluated(info.evaluated);
			}
			if (info.hasOwnProperty("carrierStatus") && this._carrierStatus != info.carrierStatus) {
				this.setCarrierStatus(info.carrierStatus);
			}
			if (info.hasOwnProperty("nodeNumber") && this.getPedNumber() != info.nodeNumber) {
				this.setPedNumber(info.nodeNumber);
			}
			if (info.hasOwnProperty("lostContact") && this.getLostContact() != info.lostContact) {
				this.setLostContact(info.lostContact);
			}
			return true;
		}
		return false;
	}
});

//ATTACHES CHILDLESS BEHAVIOR METHODS TO THIS CLASS
Person.addMethods(ChildlessBehavior);

//Added for GEL(GenomicsEngland)
//we hold name of set methods for each property in this map, this will be used in "Person.assignValues" for assigning values into each property dynamically
Person.setMethods = {};

//Added for GEL(GenomicsEngland)
//This will be used to assign values into a node and dynamically update the UI. Mainly used for drag/drop and copying an unRendered node into a node in the UI
Person.copyUnassignedNode = function(person, unRenderedValueAll){

	var yesFunction = function(){
		var disorderLoaded = false;
		var hpoLoaded = false;

		//Although all unRendered nodes are registered in Mercury and it returns "registered=true" for all
		//of them, but we also set it to True, here
		unRenderedValueAll.registered = true;

		for (var property in unRenderedValueAll) {

			if (Object.prototype.hasOwnProperty.call(unRenderedValueAll, property)) {
				var value = unRenderedValueAll[property];
				var setMethod = Person.setMethods[property];
				if(!setMethod){
					console.log("Set method '"+ setMethod + "' for property '" + property +"' not specified in 'Person.setMethods'");
					continue;
				}

				//if property is Gender, then get it in the right format
				if(property == "sex" || property == "gender"){
					value = Person.FormatGender(value);
				}


				//Do not copy the following values from unAssigned node into the destination node
				var ignoreProperties = [
					"gelsuperfamilyid",
					"ancestries",
					"consanguineouspopulation",
					"comments",
					"childlessstatus",
					"childlessreason",
					"karyotypicsex"
				];
				if(ignoreProperties.indexOf(property.toLocaleLowerCase().trim()) > -1){
					continue;
				}

				//We need to follow a certain order to fill disorder and disorderFullDetails
				if((property == "disordersFullDetails" || property == "disorders")){

					if(disorderLoaded){
						continue;
					}

					if(!unRenderedValueAll.disordersFullDetails){
						//disordersFullDetails must have been included, otherwise we can not load disorders from "disorders" in unRendered Nodes
						console.log("disordersFullDetails must have been included, otherwise we can not load disorders from 'disorders' in unRendered Nodes");
						continue;
					}

					if(unRenderedValueAll.disordersFullDetails){
						var disorders = unRenderedValueAll.disordersFullDetails;
						var newDisorderArray = [];
						for(var i = 0; i < disorders.length; i++){
							var disorder = new Disorder(disorders[i].disorderId, disorders[i].name,disorders[i].ageOfOnset,disorders[i].disorderType,disorders[i].valueAll);
							newDisorderArray.push(disorder);
						}
						var properties = {};
						properties["setDisorders"] = newDisorderArray;
						var event = { "nodeID": person.getID(), "properties": properties };
						document.fire("pedigree:node:setproperty", event);
					}

					disorderLoaded = true;
					continue;
				}

				//We need to follow a certain order to fill hpoTerms and hpoTermsFullDetails
				if((property == "hpoTerms" || property == "hpoTermsFullDetails")){

					if(hpoLoaded){
						continue;
					}

					if(!unRenderedValueAll.hpoTermsFullDetails){
						//hpoTermsFullDetails must have been included, otherwise we can not load HPO from "hpoTerms" in unRendered Nodes
						console.log("hpoTermsFullDetails must have been included, otherwise we can not load HPOs from 'hpoTerms' in unRendered Nodes");
						continue;
					}

					if(unRenderedValueAll.hpoTermsFullDetails){
						var HPOs = unRenderedValueAll.hpoTermsFullDetails;
						var newHPOArray = [];
						for(var i = 0; i < HPOs.length; i++){
							var HPO = new HPOTerm(HPOs[i].hpoId, HPOs[i].name,HPOs[i].hpoPresent, HPOs[i].valueAll);
							newHPOArray.push(HPO);
						}
						var properties = {};
						properties["setHPO"] = newHPOArray;
						var event = { "nodeID": person.getID(), "properties": properties };
						document.fire("pedigree:node:setproperty", event);
					}
					hpoLoaded = true;
					continue;
				}

				var properties = {};
				properties[setMethod] = value;
				var event = { "nodeID": person.getID(), "properties": properties };
				document.fire("pedigree:node:setproperty", event);
			}
		}
	};

	var closeFunction = function () {
		this.dialog.show();
	};

	//If target has a gender like "M","F","O" but the source gender is different from the target gender, then ask for confirmation
	var targetNodeGender = Person.FormatGender(person.getGender());
	var sourceNodeGender = Person.FormatGender(unRenderedValueAll.sex);
	var genderMessage = undefined;
	if(targetNodeGender === "M" && (sourceNodeGender === "F" || sourceNodeGender === "O" || sourceNodeGender === "unknown" )){
		genderMessage = "Gender in target node is 'Male' but in unassigned node it is '"+Person.getGenderString(sourceNodeGender)+"',<br> Are you sure you want to assign the values to this node?"
	}else if (targetNodeGender === "F" && (sourceNodeGender === "M" || sourceNodeGender === "O" || sourceNodeGender === "unknown" )){
		genderMessage = "Gender in target node is 'Female' but in unassigned node it is '"+Person.getGenderString(sourceNodeGender)+"',<br> Are you sure you want to assign the values to this node?"
	}else if (targetNodeGender === "O" && (sourceNodeGender === "M" || sourceNodeGender === "F" || sourceNodeGender === "unknown" )){
		genderMessage = "Gender in target node is 'Other' but in unassigned node it is '"+Person.getGenderString(sourceNodeGender)+"',<br> Are you sure you want to assign the values to this node?"
	}


	if(genderMessage){
		//get confirmation
		editor.getOkCancelDialogue().showCustomized(genderMessage,
			"Genomics England",
			"Yes", yesFunction,
			"No", closeFunction,
			null, true);
	}else{
		yesFunction();
	}

};

Person.FormatGender = function(genderString){
	if(genderString == null || genderString == undefined){
		return "unknown";
	}
	var genderString = genderString.toLowerCase();
	if (genderString == "female" || genderString == "f" || genderString == "2")
		return "F";
	if (genderString == "other" || genderString == "o"  || genderString == "9")
		return "O";
	else if (genderString == "male" || genderString == "m" || genderString == "1")
		return "M";
	else
		return "unknown";
};

Person.getGenderString = function(genderString){
	if(genderString == null || genderString == undefined){
		return "unknown";
	}
	var genderString = genderString.toLowerCase();

 	if (genderString == "female" || genderString == "f" || genderString == "2")
		return "Female";
	if (genderString == "other" || genderString == "o"  || genderString == "9")
		return "Other";
	else if (genderString == "male" || genderString == "m" || genderString == "1")
		return "Male";
	else
		return "Unknown";
};