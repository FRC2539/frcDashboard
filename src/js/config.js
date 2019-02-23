$(document).ready(function() {
    const $config = $('#save-config');
    const $inputs = $config.find('input,select').filter(function() {
        return typeof $(this).data('key') != 'undefined';
    });


    $config.submit(function(e) {
        e.preventDefault();
        console.log("pressed")
        
        $inputs.each(tools.inputToNT);
    });

    // Submit form with Ctrl + S
    $(window).keydown(function(e) {
        if ( ! (e.which == 83 && e.ctrlKey))
        {
            return true;
        }

        e.preventDefault();
        $config.submit();

        return false;
    });

    $inputs.each(tools.NTToInput);
});
