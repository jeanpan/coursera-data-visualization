#!/usr/bin/env python

import sys

def gml_sub(blob):

    lines = []
    for line in blob.split('\n'):
        line = line.strip()
        lines.append(line)
    blob = '\n'.join(lines)

    blob = blob.replace('\n\n', '\n')
    blob = blob.replace(']\n', '},\n')
    blob = blob.replace('[\n', '{')
    blob = blob.replace('\n{', '\n    {')
    for s in ['id', 'label', 'source', 'target', 'value']:
        blob = blob.replace(s, '"%s":' % s)
    blob = blob.replace('\n"', ', "')
    blob = blob.replace('\n}', '}')
    return blob.strip('\n')

def main(graphfile):
    '''
    Converts GML to JSON
    Usage:
    >>> python gml2json.py test.gml
    '''

    input_file = graphfile
    output_file = graphfile.split('.')[0] + '.json'

    with open(input_file, 'r') as fi:
        blob = fi.read()
    blob = ''.join(blob.split('node')[1:])
    nodes = blob.split('edge')[0]
    edges = ''.join(blob.split('edge')[1:]).strip().rstrip(']')

    nodes = gml_sub(nodes)
    edges = gml_sub(edges)

    str = '{\n "nodes":[\n'
    str += nodes.rstrip(',') + '\n'
    str += '  ],\n "edges":[\n'
    str += '    ' + edges.rstrip(',') + '\n'
    str += '  ]\n}\n'

    with open(output_file, 'w') as fo:
        fo.write(str)

    fi.close()
    fo.close()

if __name__ == '__main__':
    main(sys.argv[1])
