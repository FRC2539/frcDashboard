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

	var timeout = 0
    
	//function loadDebug(){
	NetworkTables.addGlobalListener(function(key, value, isNew) {
		//console.log("to: " + timeout);
		if (timeout >= 1){
			//console.log("updating debug");
			timeout = 0;
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
		}
	timeout += 1
    }, true);
	//}
	
	
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

    $('#reset').click(function(e) {
        // console.log("Reset hath been tttriggered")
        alert('Config values have been reset');
        
        NetworkTables.putValue("/DriveTrain/normalSpeed", 2500);
        NetworkTables.putValue("/DriveTrain/preciseSpeed", 2500);
        NetworkTables.putValue("/DriveTrain/maxSpeed", 2500);
        NetworkTables.putValue("/DriveTrain/ticksPerInch", 350);
        NetworkTables.putValue("/DriveTrain/strafeTicksPerInch", 258);
        NetworkTables.putValue("/DriveTrain/width", 23.5);
        NetworkTables.putValue("/DriveTrain/deadband", 0.05);

        NetworkTables.putValue("/DriveTrain/Speed/P", 1);
        NetworkTables.putValue("/DriveTrain/Speed/I", 0.001);
        NetworkTables.putValue("/DriveTrain/Speed/D", 31);

        NetworkTables.putValue("/DriveTrain/Speed/F", 0.7);
        NetworkTables.putValue("/DriveTrain/Speed/IZone", 30);
        NetworkTables.putValue("/DriveTrain/Speed/RampRate", 0);

        NetworkTables.putValue("/Elevator/ground", 0.0);
        NetworkTables.putValue("/Elevator/exchange", 0.0);
        NetworkTables.putValue("/Elevator/portal", 0.0);
        NetworkTables.putValue("/Elevator/switch", 0.0);
        NetworkTables.putValue("/Elevator/scale", 0.0);
        NetworkTables.putValue("/Elevator/hang", 0.0);

        NetworkTables.putValue("/Elevator/floor", 0.0);
        NetworkTables.putValue("/Elevator/aboveFloor", 0.0);
        NetworkTables.putValue("/Elevator/lowHatches", 0.0);
        NetworkTables.putValue("/Elevator/midHatches", 55.0);
        NetworkTables.putValue("/Elevator/highHatches", 130.0);
        NetworkTables.putValue("/Elevator/cargoBalls", 50.0);
        NetworkTables.putValue("/Elevator/lowBalls", 0.0);
        NetworkTables.putValue("/Elevator/midBalls", 90.0);
        NetworkTables.putValue("/Elevator/highBalls", 135.0);
        NetworkTables.putValue("/Elevator/start", 0.0);

        NetworkTables.putValue("/Arm/ground", 0);
        NetworkTables.putValue("/Arm/exchange", 0);
        NetworkTables.putValue("/Arm/portal", 0);
        NetworkTables.putValue("/Arm/switch", 0);
        NetworkTables.putValue("/Arm/scale", 0);
        NetworkTables.putValue("/Arm/hang", 0);

        NetworkTables.putValue("/Arm/floor", 0.0);
        NetworkTables.putValue("/Arm/aboveFloor", 5.0);
        NetworkTables.putValue("/Arm/lowHatches", 31.0);
        NetworkTables.putValue("/Arm/midHatches", 40.0);
        NetworkTables.putValue("/Arm/highHatches", 35.0);
        NetworkTables.putValue("/Arm/cargoBalls", 55.0);
        NetworkTables.putValue("/Arm/lowBalls", 70.0);
        NetworkTables.putValue("/Arm/midBalls", 55.0);
        NetworkTables.putValue("/Arm/highBalls", 70.0);
        NetworkTables.putValue("/Arm/start", 90.0);

        NetworkTables.putValue("/Camera/drive/width", 320);
        NetworkTables.putValue("/Camera/drive/height", 240);
        NetworkTables.putValue("/Camera/drive/fps", 30);
        NetworkTables.putValue("/Camera/drive/quality", 100);
        NetworkTables.putValue("/Camera/drive/port", 0);
        NetworkTables.putValue("/Camera/drive/server", 5801);

        NetworkTables.putValue("/Camera/process/width", 320);
        NetworkTables.putValue("/Camera/process/height", 240);
        NetworkTables.putValue("/Camera/process/fps", 15);
        NetworkTables.putValue("/Camera/process/quality", 100);
        NetworkTables.putValue("/Camera/process/port", 2);
        NetworkTables.putValue("/Camera/process/server", 5802);
    });

    var orientation = NetworkTables.getValue('DriveTrain/orientation');
    if(orientation == "Field") 
    {
        console.log("Switched To Field Orientation");
        document.body.style.backgroundColor = "red";
    }
    else
    {
        console.log("Switched To Robot Orientation");
        document.body.style.backgroundColor = "#d66621";
    }
	
	//NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
	//    ui.autoSelect.value = value;
	//});

    NetworkTables.addKeyListener('/DriveTrain/orientation', (key, value) => 
    {
		//console.log("added network listener")
        if(value == "Robot") 
        {
            console.log("Switched To Field Orientation");
            //document.body.style.backgroundColor = "red";
			$("#driveMenu").css("cssText", "background-color: red !Important;");
			$("body").css("cssText", "background-color: red !Important;");
        }
		
        else
        {
			
            console.log("Switched To Robot Orientation");
            //document.body.style.backgroundColor = "#d66621";
			$("#driveMenu").css("cssText", "background-color: #d66621 !Important;");
			$("body").css("cssText", "background-color: #d66621 !Important;");
        }

    });

    $('.btn-refresh').click(function(e) {
        console.log("clicked refresh")
        window.location.reload()
    });

	$('#refreshDebug').click(function(e) {
        console.log("clicked refresh debug")
        loadDebug()
    });

    $('#close-dashboard').click(function(e) {
        window.close();
    });
});
