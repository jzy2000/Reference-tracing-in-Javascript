var fs = require("fs"), path = require("path");
var tern = require("tern/lib/tern");
var estraverse = require("estraverse");
var escodegen = require('escodegen');
var util = require("tern/test/util");
var esprima = require('esprima');
var dfatool = require('dfatool');
var htmlparser = require("htmlparser");
var jsonpath = require('jsonpath-plus');

//Define your input here
var my_filename = "<define your file path>" //javascript file name, only for identification
var my_filesource = "<load your js source>" //javascript source code
var my_propertyname = "location"    //name of property to search
var my_new_property_prefix = "__" //prefix attached to new property name
var my_property_property = []   //known property list for the property 
var my_property_methods = []    //known methods list for the property

//init tern Server
var ternServer = new tern.Server({defs: [util.browser]});

//find and save variable location
console.log('[Searching .'+my_propertyname+' in javascript...]');
var location_list = [];
ternServer.on("postParse", function(ast){
    estraverse.traverse(ast, {
        enter: function(node,parent){
            if (node.type=='MemberExpression' && node.object && node.property && node.property.name==my_propertyname)
                location_list.push({filename: my_filename, node: node, parent: parent});
        }
    })
})

//reprint beautified source
console.log('[Saving reformatted source...]');
ternServer.addFile(my_filename, my_filesource);

//save beautified source in file named as "*.before.txt"
if (output_file) {
    var file_obj = ternServer.findFile(my_filename);
    fs.writeFileSync(my_filename+'.before.txt', escodegen.generate(file_obj.ast), 'utf8');
    console.log('[Added: '+my_filename+'.before.txt]');
}

//heuristic search keyword in object string
function search_window_document(node_obj)
{
    if (node_obj.type!='MemberExpression') return false;
    try {
        var name = escodegen.generate(node_obj);
        if (name.includes('.document') || name.includes('.window'))
        {
            console.log("[Guessed by keyword in object: '"+name+"']");
            count_guessed_obj++;
            return true;
        }
    } catch(e) {}
    return false;
}

//heuristic search property following location.
function search_location_property(parent)
{
    if (parent.type!='MemberExpression' || !parent.property || parent.property.type!='Identifier') return false;
    var property_name = parent.property.name;
    //match Location properties
    if (my_property_property.includes(property_name)) {
        console.log("[Guessed by property name]");
        count_gessed_prop++;
        return true;
    }
    //match Location methods
    if (my_property_methods.includes(property_name)) {
        console.log("[Guessed by method name]");
        count_gessed_method++;
        return true;
    }
    return false;
}

//check object type
console.log('[Searchgin .'+my_propertyname+' object type...]');
var count_this_file = 0;
for (var j=0; j<location_list.length; j++)
{
    var requestDetails = {
        query: {
            type: "type",
            file: location_list[j].filename,
            end: location_list[j].node.object.end
        }
    };
    ternServer.request(requestDetails, function(error, success){
        console.log('==============='+location_list[j].filename+' -> '+JSON.stringify(location_list[j].node.loc.start));
        console.log(escodegen.generate(location_list[j].node));
        console.log(success);
        if ( (success && !success.guess && (success.type.includes('<top>') || success.type.includes('Document'))) ||
             search_window_document(location_list[j].node.object) || 
             search_location_property(location_list[j].parent))
        {
            location_list[j].node.property.name=my_new_property_prefix+location_list[j].node.property.name;
            count_total++;
            count_this_file++;
        }
        else
            count_skipped++;
    });
}


//save modified source to file named as "*.after.txt"
console.log('===========transformed source============');
var file_obj = ternServer.findFile(my_filename);
fs.writeFileSync(my_filename+'.after.txt', escodegen.generate(file_obj.ast), 'utf8');
console.log('['+my_filename+'.after.txt added]');

//print report
console.log('['+count_total+' ('+
            (count_gessed_prop+count_gessed_method+count_guessed_obj)+' guessed) modified, '+
            count_skipped + ' skipped]');
