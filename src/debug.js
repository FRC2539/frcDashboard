$(document).ready(function($) {
    //console.log("doc ready")

    function heheeh() {
        var whewoew = Math.floor(Math.random()*9999999)
        document.getElementById("titletest").innerHTML = "Team 2539's FRC Debug of Awesomeness! א" + whewoew + " 🤖"
        setTimeout(heheeh,10)
    }
    heheeh()

    function addItem($container, id, name, last) {
        var li = '<div class="card"';
        if ( ! last)
        {
            li += ' data-role="collapsible"';
        }
        li += '>';
        $container.append(
            //<button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            $(li)
                .prop('id', id)
                .append('<div class="card-header" id="ch_'+id+'"> <h3 class="value"> <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapsey' + id + '" aria-expanded="false" aria-controls="collapsey'+id+'">' + name + '</button> </h3> </div>')
                .append(('<div id="collapsey'+id+'" class="collapse" aria-labelledby="stuff" data-parent="#networktables"><div id="stuffey'+id+'" class="card-body"></div>'))
                //<div class="card-body">Stuff in here.</div>
        );
    }

    NetworkTables.addGlobalListener(function(key, value, isNew) {
        if (key.substring(0, 12) == '/LiveWindow/')
        {
            return
        }
        key = key.split('/');
        key.shift();

        var id = 'nt';
        var $parent = $('#networktables');
        for (var i in key)
        {
            var last = (i == key.length - 1);
            if (last && Array.isArray(value))
            {
                last = false;
            }
            id += '-' + key[i].replace(/ /g, '_').replace(/~/g, '');
            if ($('#' + id).length == 0)
            {
                if (i != 0)
                {
                    var set = $parent.prop('id') + '-set';
                    if ($('#' + set).length == 0)
                    {
                        //console.log("append c content to #stuffey" + key[0])
                        $('#stuffeynt-' + key[0]).append(
                            //collapseynt-SmartDashboard
                            $('<div id="collapseynt-'+key[0]+'" class="collapse" aria-labelledby="bebans" data-role="collapsibleset" data-inset="false"><div class="card-body">'+key+' - '+value+'</div>')
                        );
                    }
                    addItem($('#' + set), id, key[i], last);
                }
                else
                {
                    addItem($parent, id, key[i], last);
                }
            }
            $parent = $('#' + id);
        }

        if (Array.isArray(value))
        {
            var output = '';
            for (var i in value)
            {
                output += '<div class="card">' + value[i] + '</div>';
            }
            if ($('#' + id + '-val').length)
            {
                $('#' + id + '-val').html(output);
            }
            else
            {
                $parent.append(
                    $('<ul id="' + id + '-val">' + output + '</ul>')
                );
            }
        }
        else
        {
            if ($('#' + id + '-val').length)
            {
                $('#' + id + '-val').html(value);
            }
            else
            {
                $parent.find('h3').append(
                    $('<span id="' + id + '-val">' + value + '</span>')
                );
            }
        }
        $('#networktables').trigger('create');

    }, true);

    var commands=[];

    NetworkTables.addGlobalListener(function(key, value, isNew) {
        if (/^\/SmartDashboard\/Commands\/[\w ]+\/\.name$/.test(key) == false)
        {
             return;
        }

        if (value.indexOf('/') != -1)
        {
            return;
        }

        if (commands.includes(value))
        {
            return;
        }

        key = key.split('/');
        key.pop();
        key = key.join('/') + '/running';

        commands.push(value);

        var id = 'command-' + commands.length;
        var html = '<button class="ui-btn ui-corner-all ui-shadow '
            + 'ui-btn-icon-right" id="' + id + '">' + value + '</button>';


        $('#stored-commands').append(html);

        $('#' + id).click(function(e) {
            NetworkTables.putValue(key, $(this).hasClass('ui-icon-action'));
        });

        NetworkTables.addKeyListener(
            key,
            function(key, value, isNew) {
                if (value)
                {
                    $('#' + id)
                        .removeClass('ui-icon-action')
                        .addClass('ui-icon-forbidden');
                }
                else
                {
                    $('#' + id)
                        .removeClass('ui-icon-forbidden')
                        .addClass('ui-icon-action');
                }
            },
            true
        );
    }, true);

    NetworkTables.addKeyListener(
        '/LiveWindow/Ungrouped/Scheduler/Ids',
        function(key, ids, isNew) {
            var names = NetworkTables.getValue(
                '/LiveWindow/Ungrouped/Scheduler/Names'
            );

            var html = '';
            for (var i in ids)
            {
                if (commands.includes(names[i]))
                {
                    continue;
                }
                html += '<button class="ui-btn ui-corner-all ui-shadow '
                    + 'ui-icon-forbidden ui-btn-icon-right" data-id="' + ids[i]
                    + '">' + names[i] + '</button>';
            }

            $('#active-commands').html(html);
        },
        true
    );

    $('#active-commands').click('button', function(e) {
        var $button = $(e.target);
        var id = parseInt($button.data('id'));
        NetworkTables.putValue(
            '/LiveWindow/Ungrouped/Scheduler/Cancel',
            [id]
        );
    });

    $('#close-dashboard').click(function(e) {
        window.close();
    });
});