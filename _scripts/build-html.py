import re

template = open("./_src/index.html","r") 
index    = open("./index.html","w") 

for line in template:
  if "<!--#" in line:
    token = re.search('<!--#\w+#-->', line).group(0)
    partialFilename = token.replace('<!--#', '').replace('#-->', '') + '.html'


    fileContents = None
    with open('./_src/partials/' + partialFilename, 'r') as partial: 
      fileContents = partial.read()
    
    builtLine = line.replace(token, fileContents)
    index.write(builtLine)
  else :
    index.write(line)

index.close()
template.close()