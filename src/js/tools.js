var tools = function() {
    const simpleInputs = [
        'text',
        'number',
        'date',
        'time',
        'url',
        'password',
        'hidden'
    ];

    const isSimple = function($el) {
        return $el.is('select') || simpleInputs.indexOf($el.prop('type')) != -1;
    };

    const coerceValue = function(val) {
        if (val !== null && isFinite(val))
        {
            val = Number(val);
        }

        return val;
    };

    return {
        inputToNT: function() {
            var $this = $(this);
            var key = $this.data('key');

            if ( ! key)
            {
                return;
            }

            if (isSimple($this))
            {
                NetworkTables.putValue(key, coerceValue($this.val()));
            }
            else if ($this.prop('type') == 'radio' && $this.is(':checked'))
            {
                NetworkTables.putValue(key, coerceValue($this.val()));
            }
            else if ($this.prop('type') == 'checkbox')
            {
                NetworkTables.putValue(key, $this.is(':checked'));
            }
        },
        NTToInput: function() {
            const $this = $(this);
            NetworkTables.addKeyListener(
                $this.data('key'),
                function(key, val, isNew) {
                    if (isSimple($this))
                    {
                        // Round number inputs to their step, if applicable.
                        if ($this.prop('type') == 'number')
                        {
                            var step = $this.prop('step');
                            if (step && isFinite(step))
                            {
                                val = Math.round(val / step) * step;
                            }
                        }
                        $this.val(val);
                    }
                    else if ($this.prop('type') == 'radio')
                    {
                        if (val == $this.val() && ! $this.is(':checked'))
                        {
                            $this.attr('checked', true);
                        }
                        else if (val != $this.val() && $this.is(':checked'))
                        {
                            $this.attr('checked', false);
                        }
                        if ($this.checkboxradio('instance'))
                        {
                            $this.checkboxradio('refresh');
                        }
                    }
                    else if ($this.prop('type') == 'checkbox')
                    {
                        if (val != $this.is(':checked'))
                        {
                            $this.click();
                        }
                    }
                },
                true
            );
        }
    };
}();
