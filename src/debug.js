$(document).ready(function($) {
    //console.log('Debug Javascript File has loaded...');

    function addItem($container, id, name, last) {
        var li = '<li';
        if ( ! last)
        {
            li += ' data-role="collapsible"';
        }
        li += '>';
        $container.append(
            $(li)
                .prop('id', id)
                .append('<h3 class="value">' + name + '</h3>')
        );
    }

    NetworkTables.addGlobalListener(function(key, value, isNew) {
        if (key.substring(0, 12) == '/LiveWindow/')
        {
            return
        }
        key = key.split('/');
        key.shift();
        //console.log('Global Listener has fired...');
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
                        $parent.append(
                            $('<ul data-role="collapsibleset" data-inset="false">')
                                .prop('id', set)
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
                output += '<li>' + value[i] + '</li>';
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
