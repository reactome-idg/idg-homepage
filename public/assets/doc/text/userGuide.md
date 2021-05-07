## Overview

Due to a bias in biological research towards already druggable genes, there is very limited knowledge about one third of protein coding genes. These understudied (or dark) proteins may offer therapeutic opportunities for many diseases. [idg.reactome.org](idg.reactome.org) contains a collection of web-based tools created to help researchers place understudied proteins in the context of manually curated, high-quality Reactome curated pathways. [Reactome](https://reactome.org/) is the most comprehensive, open access biological pathway knowledgebase, and is widely used in the community. The IDG specific tools are designed to help facilitate the generation of experimentally testable hypotheses and further the illumination of the druggable genome. The homepage of idg.reactome.org allows users to search any gene name or uniprot identifier and view where it is contained in Reactome’s annotated pathways, as well as interacting pathways reachable via one-hop pairwise relationships, if it is a dark proteina or not annotated. By default, users can view scored interacting pathways based on functional interactions predicted from a random forest model trained with 106 protein/gene pairwise relationship features covering tissue and cancer specific gene co-expression, protein/protein interactions, protein domain interactions and [GO](http://geneontology.org/) biological process annotation. In order to enhance the visualization of these interactions, we have extended the functionality of the Reactome Pathway Browser with new overlays and visualisers. In the pathway overview, users can view interacting pathways of the protein searched on the homepage. When a pathway is opened, users are presented with an extended version of the diagram viewer, allowing them to view the knowledge levels of proteins annotated in the displayed pathway, overlay multiple tissue specific gene or protein expression values from 19 data sources collected in the [target central resource database (TCRD)](http://juniper.health.unm.edu/tcrd/) at the same time, and overlay protein/protein pairwise relationships or drug/target interactions.  Furthermore, Reactome’s [SBGN](https://sbgn.github.io/)-based pathway diagrams can be converted into functional interaction networks visualized with [Cytoscape.js](https://js.cytoscape.org/). With these additional features, the idg.reactome.org offers an integrative web-based platform for researchers to study dark proteins in the context of Reactome pathways and learn potential functions of these proteins.

This user guide is meant to serve as a reference and walkthrough for how to research and gain some understanding about a dark protein using the [IDG Reactome Portal](https://idg.reactome.org/PathwayBrowser/#/). It covers how to search for a protein on the homepage, how to choose and understand interactor sets for secondary pathway interactions, how to overlay tissue specific expression data, and how to navigate the IDG specific features of the Reactome Pathway Browser.

## Using the Homepage



The homepage consists of three main components. These components allow users to search for a protein and visualize its Reactome annotated pathways and pathways accessible via one hop pairwise interaction.

![Gene Search Box](/assets/doc/images/UserGuideScreenshots/GeneSearchBox.png 'Gene Search Box')

1. Searching a term: Users can input a gene name or [Uniprot](https://www.uniprot.org/) identifier to search. After searching for a protein, the user will be presented with a card containing two sections.

![Reactome Annotated Pathway](/assets/doc/images/UserGuideScreenshots/ReactomeAnnotatedPathways.png "Reactome Annotated Pathway")

2. Understanding Annotated Pathways: The first section will be a hierarchical view of Reactome annotated pathways containing the searched term. By default, the last present top level pathway will be expanded. Each top level pathway can be expanded to show mid- and bottom-level pathways containing the searched term. Clicking on a pathway will open it in the Pathway Browser webapp with the searched term flagged in the display.

![Interacting Pathways Card](/assets/doc/images/UserGuideScreenshots/InteractingPathwaysCard.png "Interacting Pathways Card")

3. Understanding Interacting Pathways: Below the annotated pathways card is a list of interacting pathways. By default, users can view scored interacting pathways based on functional interactions predicted from a random forest model trained with 106 protein/gene pairwise relationship features covering tissue and cancer specific gene co-expression, protein/protein interactions, protein domain interactions and [GO](http://geneontology.org/) biological process annotation. After assessing which interacting genes meet the filter criteria, a pathway enrichment analysis is performed to generate hit pathways. The significance level of these "combined score" interactors can be adjusted at the top left of the secondary pathways display.

![FI Score Filter](/assets/doc/images/UserGuideScreenshots/IndividualSourcesSelection.png "FI Score Filter")

4. Choosing individual sources: Individual sources can be used to generate interacting pathways by clicking on the “choose individual sources” button in the top right of the Interacting Pathways card. The selection form guides users through choosing individual interactor sets. Up to 6 sources can be added for a single analysis. 
    **Note**: Users can return to the combined score table or choose a new set of individual sources by clicking the x icon in the top left corner of the interacting pathways card.

![Interacting Pathway Details](/assets/doc/images/UserGuideScreenshots/InteractingPathwayDetails.png "Interacting Pathway Details")

5. Interacting Pathways Details: Users can view details about any interacting pathway by clicking the carrot at the left side of each show. After expanding, users will be able to see a shortened description of the pathway and where it exists inside the pathway hierarchy. The full description of a pathway can be viewed by clicking “[more]” at the end of the shortened description.
6. Opening the Pathway Browser from an interacting pathway: Opening a pathway in the Pathway Browser webapp from the Interacting Pathways card will open the pathway with a special flagging setting. In this case, pathways and entities inside diagrams will be highlighted if they contain an interactor to the searched term on the home screen. To learn more, see the section on [Flagging with Interactors](#flagging-with-interactors).

## Functional Interaction View



The functional interaction view (FIView) provides an alternative way to visualize Pathway Diagrams. This view converts the normal diagram into a set of functional interactions that are displayed using the popular [Cytoscape.js](https://js.cytoscape.org/) plugin. 


1. Opening the FI view:  On any diagram, a Cytoscape View button will be present on the top left of the display ![FI View Button](/assets/doc/images/UserGuideScreenshots/FIViewButton.png "FI View Button").
2. Understanding the Cytoscape display: In the functional interaction network, nodes represent the individual proteins present in the Reactome diagram. Edges connecting these nodes represent a functional interaction. 
    1. Nodes: Hovering over a node will present the user with the node’s gene name and Uniprot ID. Right clicking nodes will display a menu containing information about the protein. For more information about this menu, see section (c). Protein nodes will be colored in accordance with the current tissue specific expression overlay present.
    2. Edges: Edges can have a tee’d end or an arrowed end to confer directionality. A tee’d end indicates inhibition and an arrowed end indicates activation. Hovering over an edge presents the user with the Uniprot ID of the protein on each end of the edge and the interactions directionality. Right clicking on an edge presents users with a menu displaying which reactome source the edge represents. Some edges may have multiple associated sources. In this case, the user will be able to choose which source they want the edge to represent.
    ![FI View Node Details](/assets/doc/images/UserGuideScreenshots/FIViewNodeDetails.png "FI View Node Details")
    3. Node context menu: The node context menu contains three tabs. The first offers some general information about the selected protein and links to other resources. The second tab contains information about any existing tissue specific expression overlay. Finally, the third tab contains information about any pairwise interactions present based on selected interactor sources. The top right of the menu contains a close button, a button to pin the menu so it does not close automatically when the user clicks elsewhere in the display, and a button to open the protein in an interaction popup menu (see [Section 6](#pairwise-popup)).
![FI View Settings Menu](/assets/doc/images/UserGuideScreenshots/FIViewSettingsMenu.png "FI View Settings Menu")
3. Changing layout: Layouts can be changed through the FIView settings menu. The settings menu can be opened by clicking the gear icon located on the top left button panel of the cytoscape display.

	**Note**: changing the layout will reset the position of any manually positioned nodes.

4. Adding Drug interactions: Drug interactions can be overlayed on the cytoscape display through the FIView settings menu. Drugs nodes in the display are hexagon shaped and are colored purple.

## Overlaying Data



Two types of data can be overlaid on the existing pathway diagrams and FIView. These two overlay types can be added through the Overlay tool. We support overlay of tissue specific expression data from 19 data sources provided by the [Target Central Resource Database (TCRD)](http://juniper.health.unm.edu/tcrd/) and pairwise interactor sets from multiple sources.

1. Target Development Level Overlay: By default, the diagram view and the FIView both have a persistent, default overlay of [Target Development Level](https://druggablegenome.net/ProteinFam) when no tissue specific expression data is overlaid. This is meant to help users understand the level of knowledge about each protein present in a pathway. 
2. Overlay Tool: The overlay tool contains two tabs. The first tab allows users to choose sets of tissue specific expression data to overlay on the diagram and FIView. The second tab allows users to choose sets of pairwise interactors to overlay. The Overlay Tool can be opened by clicking on the Overlay Tool button on the top left of the Diagram or FIView display. ![Overlay Tool Button](/assets/doc/images/UserGuideScreenshots/OverlayToolButton.png "Overlay Tool Button")

    ![Data Overlay Panel](/assets/doc/images/UserGuideScreenshots/OverlayDataPanel.png "Data Overlay Panel")
    1. Overlay Data menu: This menu allows users to overlay tissue specific expression data. Users can select an expression type from the “Select Expression Type” drop down. After selecting an expression type, users can select up to 12 tissues or cell lines to overlay data for at a time. Selections can be made from the list containing all tissues present for an expression type. Holding control(command on a mac) allows selection of multiple tissues. Holding shift and clicking on two tissues will select everything in between the two selections, as well. The filter box above the tissue selection list allows users to filter for specific tissue.
        **Note**: when filtering the tissues, hold control(command on a mac) to avoid de-selecting other tissues selected before applying the filter.

    ![Pairwise Relationship Panel](/assets/doc/images/UserGuideScreenshots/OverlayRelationships.png "Pairwise Relationship Panel")

    2. Overlay Relationships menu: Interaction sets are added through selection of a relationship type, data source, bioSource, and quaternary options, in that order. The available options of each dropdown will update automatically when user selections are made. In addition to these selections, users can select a line color to differentiate between positive and negative interactions for each added interactor set. Users can add up to 6 sets of interactors at a time.
3. Tissue Expression Overlay Visualization: In either visualiser, a legend is added to the right side of the window to help users visualize expression values. A control is added to the bottom of the window, as well. This control allows users to cycle through the selected tissues one at a time by pressing forward or backward or sequentially by hitting the play button. The overlay can be removed by  clicking the close button on the right of the control panel.
    1. Diagram View: In the diagram view, complexes are recolored in accordance with the average expression value of the proteins in the complex. If a user zooms in on a complex, the overlay will become segmented. Each segment’s color represents the expression value of a single protein in that complex. Expression values for individual proteins across all selected tissues can be viewed by right clicking on any complex or protein.

    ![FI View Context Expression Panel](/assets/doc/images/UserGuideScreenshots/FIViewContextExpressionPanel.png "FI View Context Expression Panel")

    2. Functional Interaction View: in the FIView, each protein is recolored in accordance with its expression. Proteins with no recorded expression for a given expression type will remain uncolored (green). Right clicking on a protein and selecting the overlay tab will list the expression for that protein across all selected tissues.
4. Pairwise Interactor Overlay Visualization: After overlaying a set of pairwise interactors, a control will appear at the bottom of the current visualiser with a close button to remove the interactors and a message about the currently loaded interactor sets.

    ![Diagram Object Decorator](/assets/doc/images/UserGuideScreenshots/DiagramObjectDecorator.png "Diagram Object Decorator")

    5. Diagram View: Complexes and entities that have associated pairwise interactors will have a red, circular decorator in the top right corner. The number or the decorator indicates how many pairwise interactors exist for that entity. Clicking on a decorator will open the pairwise popup for that entity. [See section 6](#pairwise-popup) for information on the pairwise popup.
    6. Functional Interaction View: Right clicking on a protein node while a set of pairwise interactors are loaded allows users to view which overlaid interactor sets have interactors with the protein. In the top right of the menu, a pairwise popup button will open a pairwise popup for the selected protein. [See section 6](#pairwise-popup) for information on the pairwise popup.

## Drug/Target Interactions



![Diagram Object Drug Decorator](/assets/doc/images/UserGuideScreenshots/DiagramObjectDrugDecorator.png "Diagram Object Drug Decorator")

Drug/Target interactions are overlaid by default on the Pathway Diagram. They are represented as a purple decorator in the top left corner of any entity containing Drug/Target interactions. Decorators can be clicked to open them in a Pairwise Popup ([see section 6](#pairwise-popup)). Drug/Target interactions can also be overlaid on the Functional Interaction View. In this view, drug interactions are overlaid directly onto the functional interaction network for the open pathway. Drugs can be overlaid through the FIViewSettings panel mentioned in [Section 3](#functional-interaction-view).

## Pairwise Popup



After overlaying a selection of pairwise interactors, diagram entities or FI Network nodes can be opened in a Pairwise popup to visualise its interactors. This popup offers a network view of the selected interactions and drug/target interactions. It also offers tabulated data on the present interactors and drugs. 

1. Functional Interaction Network: On top of the pairwise popup, a [Cytoscape.JS](https://js.cytoscape.org/) powered canvas shows the opened entity as a functional interaction network surrounded by its interactors. 
    1. In cases where many interactors are available for a complex, the first 10 interactors will be shown for each participant in the source entity. By default, [tDark](http://juniper.health.unm.edu/tcrd/) proteins will be displayed before other interactors. Source nodes are represented as circles and interactors are represented as triangles. 
    2. Nodes are also colored to represent the currently overlaid Tissue Specific Expression overlay. 
    3. Drugs are represented as purple hexagons. Edges are colored and dashed to help users identify which interaction set the interactor belongs to. 
    4. Interactors that are not interesting to the user can be removed by right clicking on the node and selecting remove.

        **Note**: source nodes cannot be removed

2. Pairwise Relationships Table: This table allows users to view all available interactions for the opened source. This table includes information on the interactor including it’s diagram source node, the interaction source, its current overlay value, and interaction type. Interactors that were not initially displayed in the functional interaction network can be added by clicking the view button.	
3. Drug Targets Table: This table allows users to view information for each displayed drug including the protein it interacts with, the action and activity type, and the interaction value.

## Flagging with Interactors



Users who select a pathway from the Interacting Pathways table on the new idg.reactome.org homepage will be presented with a new type of flagging.

![Fireworks Flag Control](/assets/doc/images/UserGuideScreenshots/FireworksFlagControl.png "Fireworks Flag Control")

1. Flagging in the Pathway Overview: Pathways containing interactors with the searched gene will be highlighted pink. With any set of interactors, users are able to adjust the FDR for which interactions are considered significant on a control panel at the bottom of the viewport. If the current flag is for a combined score of all interactors, users can also adjust the significance level required for an interactor to be included in the pathway enrichment analysis used to flag the pathways.
![Diagram Flagging Control](/assets/doc/images/UserGuideScreenshots/DiagramFlaggingControl.png "Diagram Flagging Control")
2. Diagram View: Entities in the diagram that contain interactors with the flagged term will be highlighted in pink. Similar to the pathway overview, if the current flag is for a combined score of all interactions, users can adjust the significance value required for an interaction to be flagged on a control panel at the bottom of the viewport. Some diagrams include encapsulated pathways. In these cases, users will also be able to filter by FDR to include more or less significant included pathways.
3. Functional Interaction View: Flagging interactions in the Functional Interaction View is very similar to how it functions in the diagram view. In this visualizer, all nodes that interact with the flagged term will be highlighted.