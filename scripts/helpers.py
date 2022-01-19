def toDict(dictToParse):
    # convert any 'AttributeDict' type found to 'dict'
    parsedDict = dict(dictToParse)
    for key, val in parsedDict.items():
        if "list" in str(type(val)):
            parsedDict[key] = [_parseValue(x) for x in val]
        else:
            parsedDict[key] = _parseValue(val)
    return parsedDict


def _parseValue(val):
    # check for nested dict structures to iterate through
    if "dict" in str(type(val)).lower():
        return toDict(val)
    # convert 'HexBytes' type to 'str'
    elif "HexBytes" in str(type(val)):
        return val.hex()
    else:
        return val
