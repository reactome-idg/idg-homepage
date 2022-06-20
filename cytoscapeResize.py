fileNames = ['dist/wc/reactome-interactor-search.js', 'dist/wc/reactome-interactor-search.min.js']
textToReplace = '("id","cytoscape-div"),t.setAttribute("width","100%"),t.setAttribute("style","min-height: 600px;")'
replacementText = '("id","cytoscape-div"),t.setAttribute("width","100%"),t.setAttribute("style","min-height: 300px;")'

def readAndReplace(fileName, textToReplace, replacementText):
    with open(fileName, 'r') as file:
        data = file.read()

    data = data.replace(textToReplace, replacementText)

    with open(fileName, 'w') as file:
        file.write(data)

for file in fileNames:
    readAndReplace(file, textToReplace, replacementText)

  
