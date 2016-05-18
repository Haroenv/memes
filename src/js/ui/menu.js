// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var Webcam = require('../plugins/webcam');

var helper = require('../app/helper');
var element = require('../app/element');
var storage = require('../app/storage');
var presets = require('../app/presets');

var overlay = require('./overlay');


// Global webcam object
var webcam;

var menu =
{
    // Global menu event bindings when the page is loaded
    init: function()
    {
        // Make sure the menu is on top when you're mousing over it
        $('.menu').on('mouseenter touchstart', function()
        {
            $(this).style({'z-index': helper.layers + 1});
        });

        // Check if menu buttons open an overlay
        $('.menu button').on('click', function()
        {
            if($(this).data('overlay'))
            {
                overlay.open($(this).data('overlay'));
            }
        });

        // Webcam stuff
        $('.start-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.stop-webcam').removeClass('hidden');
            
            webcam = new Webcam('.webcam');
        });

        $('.stop-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.start-webcam').removeClass('hidden');

            webcam.stop();
            $('.webcam').attr('src', '');
        });

        // Slideshow playback
        $('.play').on('click', function()
        {
            $(this).addClass('hidden');
            $('.pause').removeClass('hidden');
        });

        $('.pause').on('click', function()
        {
            $(this).addClass('hidden');
            $('.play').removeClass('hidden');
        });

        $('.image.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var image = element.addImage(input);

                // Save the new element in local storage
                storage.save(image.element, image.options);

                overlay.close('.image');
            }
        });

        $('.sound.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var sound = element.addAudio(input);
                storage.save(sound.element, sound.options);
                overlay.close('.sound');
            }
        });

        $('.video.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var video = element.addVideo(input);
                storage.save(video.element, video.options);
                overlay.close('.video');
            }
        });

        $('.text.overlay .border').on('click change', function()
        {
            if($(this).prop('checked'))
            {
                $('.text.overlay .use-border').removeClass('hidden');
            }
            else
            {
                $('.text.overlay .use-border').addClass('hidden');
            }
        });
        
        $('.text.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);
            var options =
            {
                text: input['text'],
                size: input['text-size'],
                color: input['text-color'],
                image: input['text-image'],
                border:
                {
                    enabled: input['border'],
                    size: input['border-size'],
                    color: input['border-color'],
                    image: input['border-image'],
                }
            };

            var text = element.addText(options);
            storage.save(text.element, text.options);
            overlay.close('.text');
        });

        $('.background.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(input.background)
            {
                $('body').style({'background': input.background});
            }

            if(input.image)
            {
                $('body').style({'background-image': 'url("'+input.image+'")'});
            }

            if(input.repeat)
            {
                $('body').style({'background-repeat': input.repeat});
            }

            if(input.position)
            {
                $('body').style({'background-position': input.position});
            }

            overlay.close('.background');
        });

        // Handler when buttons are clicekd in the presets menu
        $('.presets button').on('click', function()
        {
            var preset = $(this).data('preset');

            // If there is a handler object for this preset
            if(presets[preset] !== undefined)
            {
                // Does this preset need to be initialized?
                if(typeof presets[preset].init == "function")
                {
                    // Has it been?
                    if(presets.initialized[preset] === undefined)
                    {
                        presets[preset].init(this);
                        presets.initialized[preset] = true;
                    }
                }

                // Now call the create method
                var preset = presets[preset].create();
                storage.save(preset.element, preset.options);

                // And close the presets menu
                overlay.close('.presets');
            }
        });
    }
};

module.exports = menu;