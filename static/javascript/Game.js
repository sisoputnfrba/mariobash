var state = new GameState();

var current_room = state.getCurrentRoom();

var man_pages = {
"mv": "\nEl comando mv sirve para modificar el nombre de archivos y directorios o \n" +
"para trasladarlos a alguna otra ubicación dentro del árbol de directorios.\n\n"  +
"La instrucción mv se parece mucho a cp, excepto que borra el archivo \n" +
"original después de copiarlo. Su sintaxis es la siguiente:\n\n" +
"                   mv -opciones origen destino\n",
"mkdir": "\nEl comando mkdir, sirve para crear nuevos directorios y por lo tanto \n" +
"agrandar y mantener el orden en la estructura del sistema de archivos de Linux.\n\n"  +
"El comando consta de la siguiente sintaxis: \n\n" +
"                   mkdir -opciones directorio/s\n",
"rmdir": "\nEl comando rmdir, sirve para eliminar directorios vacíos y existentes. \n" +
"Podés especificar uno o mas directorios para eliminar, y podés expresarlos en rutas.\n\n"  +
"absolutas o relativas. El comando consta de la siguiente sintaxis: \n\n" +
"                   rmdir -opciones directorio/s\n",
"rm": "\nEl comando rm, sirve para eliminar archivos o directorios. \n" +
"Podés especificar uno o mas archivos para eliminar, y podés expresarlos en rutas.\n\n"  +
"absolutas o relativas. El comando consta de la siguiente sintaxis: \n\n" +
"                   rm -opciones archivo/s\n",
"scp": "\nEl comando scp, sirve para copiar archivos de un ordenador a otro a través de. \n" +
"una conexión segura y encriptada.\n\n"  +
"Se puede utilizar scp para copiar archivos de un ordenador local a otro remoto, también\n" +
"se puede copiar del remoto al local y también se puede copiar entre dos remotos." +
"El comando consta de la siguiente sintaxis: \n\n" +
"      1. Copiar un archivo local a un destino remoto:\n" +
"         scp archivo_origen user@ip_host:/ruta_dir_destino\n\n" +
"      2. Copiar un archivo de un ordenador remoto al ordenador local:\n" +
"         scp user@ip_host:/ruta_archivo_origen ruta_dir_destino\n\n",
"cp": "\nEl comando cp permite copiar archivos y directorios. \n" +
"El comando acepta como argumentos una fuente y un destino, de forma que el primer parámetro\n" +
"de cp es el nombre del archivo que hay copiar y el segundo es el lugar donde se desea guardar\n" +
"la copia.\n\n"  +
"El comando consta de la siguiente sintaxis: \n\n" +
"                   cp -opciones fuente destino\n",
"grep": "\nEl comando grep permite buscar palabras en un archivo. \n" +
"El comando acepta como argumentos la palabra a buscar (o un patrón) y el archivo.\n" +
"El comando consta de la siguiente sintaxis: \n\n" +
"                   grep palabra archivo\n",
"tail": "\nEl comando tail sirve para mostrar en pantalla las últimas líneas de un archivo. \n" +
"Por defecto se muestran las últimas 10 líneas, pero este número puede variar, según.\n\n"  +
"como se ejecuten las opciones. Su sintaxis es la siguiente:\n\n" +
"                   tail -opciones archivo\n" +
"Por ejemplo, tail -2 file.txt mostrará las últimas dos líneas de file.txt\n",
"head": "\nEl comando head sirve para mostrar en pantalla las primeras líneas de un archivo. \n" +
"Por defecto se muestran las primeras 10 líneas, pero este número puede variar, según.\n\n"  +
"como se ejecuten las opciones. Su sintaxis es la siguiente:\n\n" +
"                   head -opciones archivo\n" +
"Por ejemplo, head -8 file.txt mostrará las primeras ocho líneas de file.txt\n",
"cd": "\nEste comando se usa para cambiar de directorio. \n" +
"Generalmente cuando el usuario inicia sesión, el directorio donde comienza es su home.\n"  +
"Desde ahí uno puede moverse a otros directorios donde se tenga acceso usando este comando.\n" +
"Si se ejecuta 'cd ..' se vuelve un directorio atrás y 'cd' regresa al home del usuario.\n" +
"Su sintaxis es la siguiente:\n\n" +
"                   cd directorio\n\n",
"ls": "\nEl comando ls sirve para listar el contenido de los directorios. \n" +
"Si se ejecuta sin ningún parámetro muestra el contenido del directorio actual.\n\n"  +
"Su sintaxis es la siguiente:\n\n" +
"                   ls -opciones directorio\n\n",
"pwd": "\nEl comando pwd sirve para saber el directorio en el que estoy parado. \n" +
"También podemos saber esto mirando el prompt de la shell.\n\n"  +
"Su sintaxis es la siguiente:\n\n" +
"                   pwd\n\n"
}

$(document).ready(function() {

    $('#term').terminal(function(input, term) {

        var split = input.split(" ");

        var command = split[0].toString();

        var args = split.splice(1,split.length);

        if(current_room.commands.indexOf(command) > -1 ){

                current_room[command](args,term);

                    if (command in current_room.cmd_text){
                         term.echo(current_room.cmd_text[command]);
                    }
        }
        else{
            term.echo(command+": No se encontró la orden.");
        }
    }, { history: true,
        prompt: 'mario@utnso:~$ ',
        name: 'MarioBash',
        greetings:"",
        exit: false,
        clear: true,
        //height: 400
        });

    // Clear history on page reload
    $("#term").terminal().history().clear();
    // terminal starts blocked until toad finishes
    $("#term").terminal().pause()
    //Give term focus (Fixes weird initial draw issue)
    $("#term").click();
    window[term] = $("#term").terminal();
    //Tab Completion FOR LAST ARGUMENT
    $(window).keyup(function(event){
        if(event.keyCode == 9){
            var command = $("#term").terminal().get_command().replace(/\s+$/,"");
            var split_command = command.split(" ");
            var first_arg = split_command[0]
            var last_arg = split_command.pop();
            //Start in a room, try to move through path, and if we get to the end
            // check whether a room/item could complete our trip

            //Get starting room
            var search_room;
            if(last_arg.substring(0,1) == "~"){
                search_room = jQuery.extend(true, {}, Home);
            }
            else{
                search_room = jQuery.extend(true, {}, current_room);
            }
            //Iterate through each room
            var path_rooms = last_arg.split("/");
            var new_room;
            var incomplete_room;
            var substring_matches = [];
            for (room_num=0;room_num<path_rooms.length;room_num++)
            {
                new_room = search_room.can_cd(path_rooms[room_num]);
                if(new_room){
                    search_room = new_room;
                }
                else{
                    //We've made it to the final room,
                    // so we should look for things to complete our journey
                    if(room_num == path_rooms.length-1){
                        //IF cd, ls, cp, mv, less
                        //Compare to this room's children
                        if(first_arg == "cd" ||
                            first_arg == "ls" ||
                            first_arg == "mv")
                        {
                            for(child_num = 0; child_num<search_room.children.length; child_num++){
                                if(search_room.children[child_num].room_name.match("^"+path_rooms[room_num])){
                                    substring_matches.push(search_room.children[child_num].room_name);
                                }
                            }
                        }
                        //IF cp, mv, less, grep, touch
                        //Compare to this room's items
                        if(first_arg == "cp" ||
                            first_arg == "mv" ||
                            first_arg == "cat" ||
                            first_arg == "grep" ||
                            first_arg == "touch" ||
                            first_arg == "rm" ||
                            first_arg == "sudo")
                        {
                            for(item_num = 0; item_num<search_room.items.length; item_num++){
                                if(search_room.items[item_num].itemname.match("^"+path_rooms[room_num])){
                                    substring_matches.push(search_room.items[item_num].itemname);
                                }
                            }
                        }

                        //If one match exists
                        if(substring_matches.length == 1){
                            path_rooms.pop();
                            path_rooms.push(substring_matches[0]);
                            split_command.push(path_rooms.join("/"))
                            $("#term").terminal().set_command(split_command.join(" "));
                        }
                        //If multiple matches exist
                        else if(substring_matches.length > 1){
                            //Search for longest common substring (taken from: http://stackoverflow.com/questions/1837555/ajax-autocomplete-or-autosuggest-with-tab-completion-autofill-similar-to-shell/1897480#1897480)
                            var lCSindex = 0
                            var i, ch, memo
                            do {
                                memo = null
                                for (i=0; i < substring_matches.length; i++) {
                                    ch = substring_matches[i].charAt(lCSindex)
                                    if (!ch) break
                                    if (!memo) memo = ch
                                    else if (ch != memo) break
                                }
                            } while (i == substring_matches.length && ++lCSindex)

                            var longestCommonSubstring = substring_matches[0].slice(0, lCSindex)
                            //If there is a common substring...
                            if(longestCommonSubstring != ""){
                                //If it already matches the last snippit, then show the options
                                if(path_rooms[room_num] == longestCommonSubstring){
                                    split_command.push(last_arg)                                                    //Join final argument to split_command
                                    $("#term").terminal().echo(">"+split_command.join(" ").replace(/\s+$/,""));     //Print what the user entered
                                    $("#term").terminal().echo(substring_matches.join(" "));                        //Print the matches
                                    $("#term").terminal().set_command(split_command.join(" ").replace(/\s+$/,""));  //Set the text to what the user entered
                                }
                                //Otherwise, fill in the longest common substring
                                else{
                                    path_rooms.pop();                           //Pop final snippit
                                    path_rooms.push(longestCommonSubstring);    //Push longest common substring
                                    split_command.push(path_rooms.join("/"))    //Join room paths
                                    $("#term").terminal().set_command(split_command.join(" ")); //Set the terminal text to this auto-completion
                                }
                            }
                            //Otherwise, there is no common substring.  Show all of the options.
                            else{
                                split_command.push(last_arg)                                                    //Join final argument to split_command
                                $("#term").terminal().echo(">"+split_command.join(" ").replace(/\s+$/,""));     //Print what the user entered
                                $("#term").terminal().echo(substring_matches.join(" "));                        //Print the matches
                                $("#term").terminal().set_command(split_command.join(" ").replace(/\s+$/,""));  //Set the text to what the user entered
                            }
                        }
                        //If no match exists
                        else{
                            //DO NOTHING (except remove TAB)
                            $("#term").terminal().set_command(command.replace(/\s+$/,""));
                        }
                    }
                    else{
                        //DO NOTHING (except remove TAB)
                        $("#term").terminal().set_command(command.replace(/\s+$/,""));
                    }
                }
            }
        }
    });
});
