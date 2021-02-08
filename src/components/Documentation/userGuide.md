# UserGuide
<br>

### Contents
1. Overview
    1. test
2. Using the Home Page

<br />
<br />

## Overview
The Reactome Pathway Diagram View is a web-based tool, providing a biologist-friendly way to visualize proteins, complexes, and reactions in high-quality Reactome pathways. In order to put understudied proteins in the context of Reactome pathways, we have extended the Pathway Diagram View to overlay tissue-specific expression data, protein pairwise relationships, and drug/target interactions. We implemented new interfaces for users to select tissue-specific mRNA and protein expression data from 19 data sources collected in the target central resource database (TCRD). The pairwise relationship overlay allows users to display positive and negative relationships from multiple sources in the same view. We have also implemented a new visualizer via the use of Cytoscape.js, allowing a pathway to be displayed as a set of functional interactions. Drugs can be overlaid in our pairwise view and in the new functional interaction visualizer. The new features we have introduced in the Reactome Pathway Diagram View pave the way for us to predict and visualize functions of understudied proteins based on Reactome pathways.

This user guide is meant to serve as a reference and walkthrough for how to research and gain some understanding about a dark protein using the IDG reactome portal. It covers how to search for a protein on the homepage, how to choose and understand interactor sets for secondary pathway interactions, and how to navigate the IDG specific features of the Reactome Pathway Browser. In this user guide we will focus on NTN1 as a well annotated protein and PRKY as a dark protein. 

## Using the Homepage
The homepage consists of three main components. These components allow users to search for a protein and visualize its primary, Reactome annotated, pathways, and pathways accessible through one interactor.
1. Searching a gene: Users can input a gene name or Uniprot identifier to search. 
2. Understanding Primary Pathways: After searching for a protein, the user will be presented with a card containing two sections. The first section will be a hierarchical view of Reactome annotated pathways containing the searched gene. 
3. Understanding Secondary Pathways: Below this will be a displayed list of secondary pathways. In this case, secondary pathways are pathways that are reachable through 1 interacting protein. The default view uses a machine learning algorithm to combine interactor scores across all of our currated interactor sets. The significance level of these "combined score" interactors can be adjusted at the top left of the secondary pathways display (see diagram below).