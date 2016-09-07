// ==========================================================================
// Plyr.io demo
// This code is purely for the plyr.io website
// Please see readme.md in the root or github.com/selz/plyr
// ==========================================================================

/*global plyr*/

// General functions
;(function() {
    //document.body.addEventListener('ready', function(event) { console.log(event); });

    // Setup the player
    var instances = plyr.setup({
        debug:              false,
        title:              'Video demo',
        iconUrl:            '../dist/plyr.svg',
        tooltips: {
            controls:       true
        },
        captions: {
            defaultActive:  true
        },
        controls:           ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'quality', 'fullscreen']
    });
    plyr.loadSprite('dist/demo.svg');

    // Plyr returns an array regardless
    var player = instances[0];

    // player.on('setup', function(event) {
        // var instance = event.detail.plyr;

        player.source({
            type:       'video',
            title:      'Example title',
            sources: [{
              src:    'http://player.vimeo.com/external/144711856.hd.mp4?s=7d85bdceeeec211dbd8687cdf592c147b52039dc&profile_id=119&oauth2_token_id=56507941',
              type:   'video/mp4',
              label:  '1080p'
            },
            {
              src:    'http://player.vimeo.com/external/144711856.hd.mp4?s=7d85bdceeeec211dbd8687cdf592c147b52039dc&profile_id=113&oauth2_token_id=56507941',
              type:   'video/mp4',
              label:  '720p'
            },
            {
              src:    'http://player.vimeo.com/external/144711856.sd.mp4?s=9d6197928f4cc7a14114f5b3364e05a59bf71e89&profile_id=112&oauth2_token_id=56507941',
              type:   'video/mp4',
              label:  '540p'
            },
            {
              src:    'http://player.vimeo.com/external/144711856.mobile.mp4?s=4b5236e61a62667dc03dd81b1bf015c451c15758&profile_id=116&oauth2_token_id=56507941',
              type:   'video/mp4',
              label:  '270p'
            }],
            poster:     'https://i.vimeocdn.com/video/542616471_640x360.jpg?r=pad',
            tracks:     [{
              kind:   'subtitles',
              label:  'Chinese (Traditional Han)',
              srclang:'zh-Hant',
              src:    'http://f.vimeocdn.com/tt/4208523?token=Zp0kuY+3oxFIAvYtvE+LRqETLSnv1DZeEqEnPay6IDM=',
              default: true
            }]
        });
    // });

    window.player = player;

    // Setup type toggle
    var buttons = document.querySelectorAll('[data-source]'),
        types = {
            video:      'video',
            audio:      'audio',
            youtube:    'youtube',
            vimeo:      'vimeo'
        },
        currentType = window.location.hash.replace('#', ''),
        historySupport = (window.history && window.history.pushState);

    // Bind to each button
    for (var i = buttons.length - 1; i >= 0; i--) {
        buttons[i].addEventListener('click', function() {
            var type = this.getAttribute('data-source');

            newSource(type);

            if (historySupport) {
                history.pushState({ 'type': type }, '', '#' + type);
            }
        });
    }

    player.on('canplay', function(event) {
        console.log('canplay for main');
    });

    player.on('play', function(event) {
        console.log('play for main');
    });

    // List for backwards/forwards
    window.addEventListener('popstate', function(event) {
        if(event.state && 'type' in event.state) {
            newSource(event.state.type);
        }
    });

    // On load
    if(historySupport) {
        var video = !currentType.length;

        // If there's no current type set, assume video
        if(video) {
            currentType = types.video;
        }

        // Replace current history state
        if(currentType in types) {
            history.replaceState({ 'type': currentType }, '', (video ? '' : '#' + currentType));
        }

        // If it's not video, load the source
        if(currentType !== types.video) {
            newSource(currentType, true);
        }
    }

    // Toggle class on an element
    function toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            }
            else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

    // Set a new source
    function newSource(type, init) {
        // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
        if(!(type in types) || (!init && type == currentType) || (!currentType.length && type == types.video)) {
            return;
        }

        switch(type) {
            case types.video:
                player.source({
                    type:       'video',
                    title:      'View From A Blue Moon',
                    sources: [{
                        src:    'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4',
                        type:   'video/mp4'
                    },
                    {
                        src:    'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.webm',
                        type:   'video/webm'
                    }],
                    poster:     'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.jpg',
                    tracks:     [{
                        kind:   'captions',
                        label:  'English',
                        srclang:'en',
                        src:    'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
                        default: true
                    }]
                });
                break;

            case types.audio:
                player.source({
                    type:       'audio',
                    title:      'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
                    sources: [{
                        src:    'https://cdn.selz.com/plyr/1.5/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
                        type:   'audio/mp3'
                    },
                    {
                        src:    'https://cdn.selz.com/plyr/1.5/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
                        type:   'audio/ogg'
                    }]
                });
                break;

            case types.youtube:
                player.source({
                    type:       'video',
                    title:      'View From A Blue Moon',
                    sources: [{
                        src:    'bTqVqk7FSmY',
                        type:   'youtube'
                    }]
                });
                break;

            case types.vimeo:
                player.source({
                    type:       'video',
                    title:      'View From A Blue Moon',
                    sources: [{
                        src:    '143418951',
                        type:   'vimeo'
                    }]
                });
                break;
        }

        // Set the current type for next time
        currentType = type;

        // Remove active classes
        for (var x = buttons.length - 1; x >= 0; x--) {
            toggleClass(buttons[x].parentElement, 'active', false);
        }

        // Set active on parent
        toggleClass(document.querySelector('[data-source="'+ type +'"]').parentElement, 'active', true);
    }
})();

// Google analytics
// For demo site (http://[www.]plyr.io) only
if(document.domain.indexOf('plyr.io') > -1) {
    (function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-40881672-11', 'auto');
    ga('send', 'pageview');
}
