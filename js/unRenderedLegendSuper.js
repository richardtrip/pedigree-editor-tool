/**
 * This class is added by Soheil for GEL(GenomicsEngland) 05.09.2016
 * This will help to present UnRendered nodes in a legend
 * This is a copy of hpoLegend.js and then modified and added new methods such as addNode
 * @class Legend
 * @constructor
 */

var unRenderedLegendSuper = Class.create(Legend, {


	/**
	 * Added by Soheil for GEL(GenomicsEngland)
	 * Add a node into unRenderedNode legend
	 *
	 * @param id
	 * @param name
	 * @param nodeID
	 * @param node
	 */
	addNode: function(node) {
		var id = Object.keys(this._affectedNodes).length;
		if (Object.keys(this._affectedNodes).length == 0) {
			this._legendBox.show();
			!editor.getPreferencesManager().getConfigurationOption("hideDraggingHint") &&
			this._legendInfo && this._legendInfo.show();
		}
		if (!this._hasAffectedNodes(id)) {
			this._affectedNodes[id] = [id];
			var listElement = this._generateNode(id, node);
			this._list.insert(listElement);
		}

		this._updateCaseNumbersForObject(id);
	},

	/**
	 * Add the array of nodes in bulk
	 * @param nodes
	 */
	addAllNodes: function(nodes) {
		for(var i = 0; nodes && i < nodes.length;i++){
			this.addNode(nodes[i]);
		}
	},

	/**
	 * Remove all nodes in unRendered legend list
	 */
	removeAllNodes: function () {
		var currentNodesLength = Object.keys(this._affectedNodes).length;
		for(var i = 0; i < currentNodesLength; i++){
			var htmlElement = $(this._getPrefix() + i);
			htmlElement.remove();
		}

		this._legendBox.hide();
		if (this._legendBox.up().select('.abnormality').size() == 0) {
			this._legendInfo && this._legendInfo.hide();
		}

		this._affectedNodes = {};
		this._objectColors  = {};

	},

	/**
	 * Added by Soheil for GEL(GenomicsEngland)
	 *
	 * @param id
	 * @param name
	 * @param nodeID
	 * @param node
	 * @returns {*}
	 * @private
	 */
	_generateNode: function(id, node ) {

		var color = this.getObjectColor(id);
		var HTMLContent = node.participantId + "<br>";

		var item = new Element('li', {'class': 'abnormality ' + 'drop-' + this._getPrefix(), 'id': this._getPrefix() + id}).update(HTMLContent);//new Element('span', {'class': 'disorder-name'}).update("ID"));

		item.insert(new Element('span', {class:'unRenderedItemName'}).update("NHS#: "));
		item.insert(new Element('span', {class:'unRenderedItemValue'}).update(node.nhsNumber));
		item.insert(new Element('span', {}).update("<br>"));

		item.insert(new Element('span', {class:'unRenderedItemName'}).update("CHI#: "));
		item.insert(new Element('span', {class:'unRenderedItemValue'}).update(node.chiNumber));
		item.insert(new Element('span', {}).update("<br>"));

		item.insert(new Element('span', {class:'unRenderedItemName'}).update("Forenames: "));
		item.insert(new Element('span', {class:'unRenderedItemValue'}).update(node.firstName));
		item.insert(new Element('span', {}).update("<br>"));

		item.insert(new Element('span', {class:'unRenderedItemName'}).update("Surname: "));
		item.insert(new Element('span', {class:'unRenderedItemValue'}).update(node.lastName));
		item.insert(new Element('span', {}).update("<br>"));

		item.insert(new Element('span', {class:'unRenderedItemName'}).update("Relation: "));
		item.insert(new Element('span', {class:'unRenderedItemValue'}).update(node.relationshipToProband));
		item.insert(new Element('span', {}).update("<br>"));



		//Hidden elements should has .unRenderedHidden CSS Class ......................................................
		item.insert(new Element('span', {class:'unRenderedItemName unRenderedHidden'}).update("Surname: "));
		item.insert(new Element('span', {class:'unRenderedItemValue unRenderedHidden'}).update(node.lastName));
		item.insert(new Element('span', {class:'unRenderedHidden'}).update("<br>"));


		item.insert(new Element('span', {class:'unRenderedItemName unRenderedHidden'}).update("Hidden2: "));
		item.insert(new Element('span', {class:'unRenderedItemValue unRenderedHidden'}).update(node.lastName));
		item.insert(new Element('span', {class:'unRenderedHidden'}).update("<br>"));

		//.............................................................................................................


		var moreValuesDots = new Element('span', {class:'moreValueDots'}).update("...&nbsp;");
		var plusElement = new Element('span', {style:'cursor:pointer;font-size: 90%;'}).insert(moreValuesDots).insert('<i class="fa fa-plus-square-o" aria-hidden="true"></i>');
		item.insert(plusElement);


		item.select("span.unRenderedHidden").each(Element.hide);

		plusElement.observe('click', function(event) {
			var plusIcon = this.select("i")[0];
			if(plusIcon.hasClassName('fa-plus-square-o')){
				plusIcon.removeClassName('fa-plus-square-o');
				plusIcon.addClassName('fa-minus-square-o');
				//SHOW THE VALUES
				item.select("span.unRenderedHidden").each(Element.show);
				moreValuesDots.hide();
			}else{
				plusIcon.addClassName('fa-plus-square-o');
				plusIcon.removeClassName('fa-minus-square-o');
				//HIDE THE VALUES
				item.select("span.unRenderedHidden").each(Element.hide);
				moreValuesDots.show();
			}
		});


 		item.insert(new Element('input', {'type': 'hidden', 'value': id}));

		var bubble = new Element('span', {'class': 'UnRendered-abnormality-color'});
		bubble.style.backgroundColor = color;
		item.insert({'top': bubble});

		var countLabelContainer = new Element('span', {'class': 'abnormality-cases-container'});
		item.insert(" ").insert(countLabelContainer);
		return item;
	}

});