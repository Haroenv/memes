// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load other stuff
var extend = require('extend');
var helper = require('./helper');
var TextMagick = require('./textmagick');
var storage = require('./storage');

// Helper functions for creating elements on the page
var element =
{

    addNew: function(element, options)
    {
        // Check if audio / video specific options need to be added
        if(options.type == 'audio' || options.type == 'video')
        {
            $(element).attr('volume', options.volume);
            $(element).attr('autoplay', options.autoplay);
            $(element).attr('loop', options.loop);
            $(element).attr('controls', options.controls);
        }

        // Add license information if provided
        $(element).data('desc', options.desc);
        $(element).data('license', options.license);

        // Add the new element to the workspace
        $('.workspace').el[0].appendChild(element);

        // Make sure it's on the top layer
        $(element).style({'z-index': helper.layers + 1});

        // Centered option automatically centers the new element in the middle of the page
        if(options.centered)
        {
            $(element).style({
                'position': 'absolute',
                'left': ($(window).width() / 2 - $(element).width() / 2) + 'px',
                'top': ($(window).height() / 2 - $(element).height() / 2) + 'px',
            });
        }

        // Duration option will remove the element after a certain amount of time
        if(options.duration)
        {
            setTimeout(function()
            {
                $(element).remove();
            }, options.duration);
        }

        $(element).dragondrop();

        // Save the new element in local storage
        storage.save(element, options);

        // Ensure the element being dragged is always on top
        $(element).on('dragstart', function()
        {
            helper.layers++;
            $(this).style({'z-index': helper.layers});
        });
    },

    addImage: function(options)
    {
        var defaults =
        {
            type: 'image',
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var image = document.createElement('img');
        $(image).attr('src', options.url);

        element.addNew(image, options);

        return image;
    },

    addSound: function(options)
    {
        var defaults =
        {
            type: 'audio',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var sound = document.createElement('audio');
        $(sound).attr('src', options.url);

        element.addNew(sound, options);

        return sound;
    },

    addVideo: function(options)
    {
        var defaults =
        {
            type: 'video',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var video = document.createElement('video');
        $(video).attr('src', options.url);

        element.addNew(video, options);

        return video;
    },

    addText: function(options)
    {
        var defaults =
        {
            type: 'text',
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var text = new TextMagick(options.text, options);
        var element = text.getElement();

        element.addNew(element, options);
        text.resize();

        return text;
    },
};

module.exports = element;