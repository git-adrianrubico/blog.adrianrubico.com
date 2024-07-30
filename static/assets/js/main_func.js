const LoadMoreButton = document.getElementById('load-more');
const noMorePost = document.getElementById('no-more-post');
const regex_non_ajax = /\/post\/.+/;
const currentUrl_non_ajax = window.location.href;
const postsDVHeaderLink = document.getElementById('posts-dv-link');
const postsMVHeaderLink = document.getElementById('posts-mv-link');
var aboutMeLink = document.getElementById('about_me_link');
let isDirect = false;
let isClickPost = false;
let resetScrollPosition = false;
let historyStack = getHistoryStack(); 
var loadingTimeout; // Declare loadingTimeout variable
let scrollPreviousPositions;
let morePostsHomeAvailable = true;
let activate_has_remaining_post = false;
let displayedPosts = 5;
let remaining_posts;
var globalCurrentUrl;
let emailValid = false;
let recaptchaValid = false;
let viewer;

const baseContainer = document.getElementById('base_container');
//console.log(baseContainer);

function saveHistoryStack() {
    localStorage.setItem('historyStack', JSON.stringify(historyStack)); 
    // console.log(historyStack);
}

function getHistoryStack() {
    const json = localStorage.getItem('historyStack');
    return json ? JSON.parse(json) : [];  
}

window.onload = function() {
    historyStack = getHistoryStack();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function codeblocks() {
    $('pre > code').each(function() {
        var $this = $(this);
        var classes = $this.attr('class').split(/\s+/);
        var containsOtherLanguage = classes.some(function(className) {
            return className.startsWith('language-') && className !== 'language-plaintext';
        });

        // Remove 'language-plaintext' only if there is another language class
        if (containsOtherLanguage) {
            $this.removeClass('language-plaintext');
        }

        hljs.highlightBlock(this);
    });
}

function blurLoading() {
    const blurDivs = document.querySelectorAll(".blur-load");
    mediumZoom("#zoom-background", { background: "rgba(25, 18, 25, 0.9)" });
    
    // Create an array of promises for image loading
    const imageLoadPromises = [];

    blurDivs.forEach(div => {
        const img = div.querySelector("img");

        const imgLoadPromise = new Promise((resolve, reject) => {
            function loaded() {
                div.classList.add("loaded");
                div.style.backgroundImage = "none";
                resolve();
            }

            if (img.complete) {
                loaded();
            } else {
                img.addEventListener("load", loaded);
                img.addEventListener("error", reject);
            }
        });

        imageLoadPromises.push(imgLoadPromise);
    });

    // Return a promise that resolves when all images are loaded
    return Promise.resolve();
}

function blurMainLoading() {
    const blurDivs = document.querySelectorAll(".blur-load-main");
    
    // Create an array of promises for image loading
    const imageLoadPromises = [];

    blurDivs.forEach(div => {
        const img = div.querySelector("img");
        const imgLoadPromise = new Promise((resolve, reject) => {
            function loaded() {
                div.classList.add("loaded");
                div.style.backgroundImage = "none";
                resolve();
            }

            if (img.complete) {
                loaded();
            } else {
                img.addEventListener("load", loaded);
                img.addEventListener("error", reject);
            }
        });

        imageLoadPromises.push(imgLoadPromise);
    });

    // Return a promise that resolves when all images are loaded
    return Promise.resolve();
}


// Check if we are on the main page 
if(window.location.pathname === '/' || window.location.pathname === '') {
    isDirect = false;
    
    NProgress.start();
        window.onload = function() {
            NProgress.done();
        };

    document.title = 'Adrian Rubico | Blog';
    postsDVHeaderLink.classList.add('active');
    postsMVHeaderLink.classList.add('active');
    blurMainLoading();
    // Reset historyStack
    historyStack = [];
    
    // Remove from localStorage
    localStorage.removeItem('historyStack');

} else {
    isDirect = true;
    NProgress.start();
    // This function it will access the post details
    //console.log("get historyStack");

    // Get historyStack from storage on other pages
    historyStack = getHistoryStack();
    const getPathTitle = window.location.pathname;
    //console.log(getPathTitle);
    if (getPathTitle.startsWith('/post')) {
        // Remove '/post/' part, replace dashes with spaces, and remove the trailing slash
        const formattedTitle = getPathTitle.replace('/post/', '').replace(/-/g, ' ').replace(/\/$/, '');
        // Output the formatted title
        document.title = formattedTitle;
    } else if (getPathTitle.startsWith('/unsubscribe') || getPathTitle.startsWith('/unsubscribe_success') || getPathTitle.startsWith('/unsubscribe_error')) {
        // Set default title for specific paths
        document.title = 'Adrian Rubico | Blog';
    } else {
        // Handle other paths if necessary
        document.title = 'Adrian Rubico | Blog';
    }
    codeblocks();

    $('#non-ajax-blogcard-group').css({'padding' : '0px 5px 0px 5px'});
    postsDVHeaderLink.classList.remove('active');
    postsMVHeaderLink.classList.remove('active');
    blurLoading().then(() => {
        NProgress.done();
    });
    

    // Enable email input validation and ReCaptcha callback after fetching the post
    const emailInput = document.getElementById('subscribe-email');
    const submitButton = document.getElementById('recaptcha-submit');

    emailInput.addEventListener('input', () => {
        emailValid = validateEmail(emailInput.value);
        toggleSubmitButton();
    });

    function toggleSubmitButton() {
        if (emailValid && recaptchaValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    window.enableFormSubmit = function() {
        recaptchaValid = true;
        toggleSubmitButton();
    };

}


function EventPath(path){
    if (path.startsWith('/post')) {
        // Remove '/post/' part, replace dashes with spaces, and remove the trailing slash
        const formattedTitle = path.replace('/post/', '').replace(/-/g, ' ').replace(/\/$/, '');
        // Output the formatted title
        document.title = formattedTitle;
    } else if (path.startsWith('/unsubscribe') || path.startsWith('/unsubscribe_success') || path.startsWith('/unsubscribe_error')) {
        // Set default title for specific paths
        document.title = 'Adrian Rubico | Blog';
    } else {
        // Handle other paths if necessary
        document.title = 'Adrian Rubico | Blog';
    }

    const regex = /^\/post\//;
    emailValid = false;
    recaptchaValid = false;
    // Get the current URL
    const currentURL = window.location.pathname;
    //console.log(currentURL);
    
    let search_displayed_post = 5;
    postsDVHeaderLink.classList.remove('active');
    const scrollTempPosition = window.scrollY;
    // console.log(scrollTempPosition);
    window.onscroll = function () { window.scrollTo(0, scrollTempPosition); };

    let previousPath = path;
    //console.log(historyStack);
    scrollPreviousPositions = scrollTempPosition;
    historyStack.push({ previousPath, scrollPreviousPositions });
    saveHistoryStack();

    // const lastEntry = historyStack[historyStack.length - 1];
    // console.log(lastEntry);
    
    const lastEntryV2 = historyStack[historyStack.length - 2];
    //console.log(lastEntryV2);

    // Start NProgress before the fetch request
    NProgress.start();
    // If there's a specific path in the state, navigate to that path
    $.ajax({
        type: "GET",
        url: path + `?displayed_posts_search=${search_displayed_post}`,
        cache: false,
        success: function(data) {
            window.onscroll = null;

            const scrollPst = (typeof lastEntryV2 !== 'undefined') ? lastEntryV2.scrollPreviousPositions : 0;

            setTimeout(function() {
                $('html, body').animate({scrollTop: scrollPst}, 400);
                $("#post-details-container").html(data.html_content);
                // Ensure NProgress stops only after images are loaded
                blurLoading().then(() => {
                    NProgress.done();
                });
                
                // Update Open Graph meta tags
                document.getElementById('og-title').setAttribute('content', data.og_title);
                document.getElementById('og-description').setAttribute('content', data.og_description);
                document.getElementById('og-image').setAttribute('content', data.og_image);
                document.getElementById('og-url').setAttribute('content', data.og_url);

                if (regex.test(currentURL)) {
                    // Stop NProgress if an error occurs
                    NProgress.done();
                    //blurLoading();
                    //console.log("has post/");
                    //$('pre > code').each(function() { hljs.highlightBlock(this); });

                    codeblocks();

                    const emailInput = document.getElementById('subscribe-email');
                    const submitButton = document.getElementById('recaptcha-submit');
                    emailInput.addEventListener('input', () => {
                        emailValid = validateEmail(emailInput.value);
                        toggleSubmitButton();
                    });

                    function toggleSubmitButton() {
                        if (emailValid && recaptchaValid) {
                            submitButton.disabled = false;
                        } else {
                            submitButton.disabled = true;
                        }
                    }

                    window.enableFormSubmit = function() {
                        recaptchaValid = true;
                        toggleSubmitButton();
                    };
                } else {
                    //console.log("no post/");
                    $('#post-container').css('width', '900px');
                }
            
            }, 800);
        },
        error: function(error) {
            // Stop NProgress if an error occurs
            NProgress.done();
            // Handle the error response from the server
            console.log("AJAX request failed:", error);
        }
    });
}

let isPathDirect;

// Handle the popstate event
window.onpopstate = function(event) {
    event.preventDefault();

    if (event.state) {
        //console.log('event.state.path');
        let path = event.state.path;
        //console.log(path);
        if (typeof path === "undefined") {
            path = isPathDirect;
        }
        EventPath(path);
        
    } else {
        //console.log("else if no state");
        if (isDirect === true & isClickPost === true) {
            isDirect = false;
            isClickPost = false;
            let path = window.location.pathname;
            //console.log(path);
            EventPath(path);
            history.replaceState(path, null, path);
            isPathDirect = path;
        } else {
            history.scrollRestoration = "manual";
            document.title = 'Adrian Rubico | Blog';
            const scrollTempPosition = window.scrollY;
            
            // STOP THE SCROLL BEHAVIOR ON THIS
            //$(window).scrollTop(scrollTempPosition);

            window.onscroll = function () { window.scrollTo(scrollTempPosition); };
            
            
            scrollPreviousPositions = scrollTempPosition;
            postsDVHeaderLink.classList.add('active');
            postsMVHeaderLink.classList.add('active');
            emailValid = false;
            recaptchaValid = false;

            let previousPath = window.location.pathname;
            //console.log(previousPath);
            const lastEntry = historyStack[historyStack.length - 1];
            //console.log(lastEntry);
            //console.log("pushing PreviousPath: " + previousPath + ", scrollPreviousPositions: " + scrollPreviousPositions);

            historyStack.push({ previousPath, scrollPreviousPositions });
            saveHistoryStack();
            history.replaceState(null, null, '/');
            scrollPreviousPositions = lastEntry.scrollPreviousPositions;
            // Start NProgress before the fetch request
            NProgress.start();
            $.ajax({
                type: "GET",
                url: `/posts/?displayed_posts=${displayedPosts}`,
                cache: false,
                success: function(data) {
                    //console.log('back to main page');
                    window.onscroll = null;

                    setTimeout(function() {
                        
                        $('#post-container').css('width', '900px');
                        $("#post-details-container").html(data.html_content);

                        // Ensure NProgress stops only after images are loaded
                        blurMainLoading().then(() => {
                            NProgress.done();
                        });
                        
                        document.getElementById('H2-Text').style.display = 'block';
                        //console.log(scrollPreviousPositions + "scrollPositio: will animate at this position");
                        $('html, body').animate({scrollTop: scrollPreviousPositions}, 400);
                        // console.log(data.posts_count);
                        if (data.posts_count >= 5) {
                            if (morePostsHomeAvailable) {
                                document.getElementById('load-more').style.display = 'block';
                                document.getElementById('no-more-post').style.display = 'none';
                            } else {
                                document.getElementById('load-more').style.display = 'none';
                                document.getElementById('no-more-post').style.display = 'block';
                            }
                        } else {
                            document.getElementById('load-more').style.display = 'none';
                            document.getElementById('no-more-post').style.display = 'none';
                        }
                    }, 1500);
                },
                error: function(error) {
                    // Stop NProgress if an error occurs
                    NProgress.done();
                    // Handle the error response from the server
                    console.log("AJAX request for default posts failed:", error);
                }
            });
        }
    }
};

// For post details only
$(document).on('click', '.post-title-link, .post-image-link', function (e) {
    e.preventDefault();
    isDirect = false;
    isClickPost = false;
    hljs.highlightAll();
    postsDVHeaderLink.classList.remove('active');
    postsMVHeaderLink.classList.remove('active');

    // Use the stored post slug
    var postSlug = $(this).data('post-slug');
    scrollPreviousPositions = window.scrollY;
    //console.log(scrollPreviousPositions + ": post-title-link post-image-link(main page only)");

    // Start NProgress before the fetch request
    NProgress.start();

    fetch(`/post/${postSlug}`, {
        method: 'GET',
        headers: {
            'x-requested-with': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log("success");
        $('html, body').animate({scrollTop: 0}, 400);
        $('.blog-main-container').css('width', 'unset');
        $('#post-container').html(data.html_content);
        

        //$('#post-container').html(data.html_content);
        // Update the page title
        document.title = data.og_title;
        // Update Open Graph meta tags
        document.getElementById('og-title').setAttribute('content', data.og_title);
        document.getElementById('og-description').setAttribute('content', data.og_description);
        document.getElementById('og-image').setAttribute('content', data.og_image);
        document.getElementById('og-url').setAttribute('content', data.og_url);
        
        //$('pre > code').each(function() { hljs.highlightBlock(this); });

        codeblocks();

        if (LoadMoreButton) {
            document.getElementById('load-more').style.display = 'none';
            document.getElementById('no-more-post').style.display = 'none';
        }

        const newUrl = `/post/${postSlug}`;
        history.pushState({ path: newUrl }, "", newUrl);
        const currentUrl = newUrl;
        historyStack.push({ currentUrl, scrollPreviousPositions });
        saveHistoryStack();

        // Enable email input validation and ReCaptcha callback after fetching the post
        const emailInput = document.getElementById('subscribe-email');
        const submitButton = document.getElementById('recaptcha-submit');
        
        emailInput.addEventListener('input', () => {
            emailValid = validateEmail(emailInput.value);
            toggleSubmitButton();
        });

        function toggleSubmitButton() {
            if (emailValid && recaptchaValid) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        }

        window.enableFormSubmit = function() {
            recaptchaValid = true;
            toggleSubmitButton();
        };

        return blurLoading(); // Return the promise from blurLoading

        
    })
    .then(() => {
        // Stop NProgress after all images are loaded
        NProgress.done();
        
    })
    .catch(error => {
        // Stop NProgress if an error occurs
        NProgress.done();
        console.error('Error:', error);
    });
});

function LoadMoreBtn() {
    const postContainer = document.getElementById('post-container');
    //console.log("load-more clicked");

    // Make AJAX request to load more posts
    fetch(`/load_more_posts/?displayed_posts=${displayedPosts}`, {
    method: 'GET',
    headers: {
        'x-requested-with': 'XMLHttpRequest'
    }
    }).then(response => response.json()).then(data => {
    // Append new posts to the post container
    postContainer.insertAdjacentHTML('beforeend', data.html_content);
    blurMainLoading();
    // Update displayed posts count
    displayedPosts += 5;
    //console.log(data.has_remaining_posts);
    // Hide the "Load More" button if no more posts
    if (!data.has_remaining_posts) {
        morePostsHomeAvailable = false;
        //console.log("no post remaining");
        // LoadMoreButton.style.display = 'none';
        document.getElementById('load-more').style.display = 'none';
        document.getElementById('no-more-post').style.display = 'block';
        // noMorePost.style.display = 'block';
    } else {
        morePostsHomeAvailable = true;
    }
    }).catch(error => console.error('Error:', error));
};

let isRequestPending = false;

$(document).on('click', '.posts-header-desktopview, .posts-header-mobileview', function (e) {
    e.preventDefault();  // Prevent the default link behavior
    const homeUrl = $(this).data('home-url');
    //console.log("Click Post home");

    if (window.location.pathname === '/' || window.location.href === homeUrl) {
        return;
    }

    if (isRequestPending) {
        return;  // Exit the function if a request is already pending
    }

    isRequestPending = true;  // Set the flag to true to indicate an ongoing request

    const scrollTempPosition = window.scrollY;
    window.onscroll = function () { window.scrollTo(scrollTempPosition); };
    var scrollPreviousPositions = scrollTempPosition;

    document.title = 'Adrian Rubico | Blog';
    postsDVHeaderLink.classList.add('active');
    postsMVHeaderLink.classList.add('active');

    let previousPath = window.location.pathname;
    const lastEntry = historyStack[historyStack.length - 1];

    //console.log("pushing PreviousPath: " + previousPath + ", scrollPreviousPositions: " + scrollPreviousPositions);

    historyStack.push({ previousPath, scrollPreviousPositions });
    saveHistoryStack();
    //console.log(historyStack);

    const scrollPst = (typeof lastEntry !== 'undefined') ? lastEntry.scrollPreviousPositions : 0;

    // Start NProgress before the fetch request
    NProgress.start();
    $.ajax({
        type: "GET",
        url: `${homeUrl}?displayed_posts=${displayedPosts}`,
        cache: false,
        success: function(data) {
            isDirect = true;
            isClickPost = true;
            history.pushState(null, null, '/');
            window.onscroll = null;
            setTimeout(function() {
                $('#post-container').css('width', '900px');
                $("#post-details-container").html(data.html_content);
                blurMainLoading();
                document.getElementById('H2-Text').style.display = 'block';
                //console.log(scrollPreviousPositions + " scrollPositio: will animate at this position");
                $('html, body').animate({scrollTop: scrollPst}, 400);
                //displayedPostsSearch = 5;
                if (data.posts_count >= 5) {
                    if (morePostsHomeAvailable) {
                        document.getElementById('load-more').style.display = 'block';
                        document.getElementById('no-more-post').style.display = 'none';
                    } else {
                        document.getElementById('load-more').style.display = 'none';
                        document.getElementById('no-more-post').style.display = 'block';
                    }
                } else {
                    document.getElementById('load-more').style.display = 'none';
                    document.getElementById('no-more-post').style.display = 'none';
                }
                // Ensure NProgress stops only after images are loaded
                blurLoading().then(() => {
                    NProgress.done();
                    isRequestPending = false;  // Reset the flag when the request is complete
                });
            }, 1000);
        },
        error: function(error) {
            // Stop NProgress if an error occurs
            NProgress.done();
            // Handle the error response from the server
            console.log("AJAX request for default posts failed:", error);
            isRequestPending = false;  // Reset the flag in case of an error
        }
    });
});


$(document).on('click', '#recaptcha-submit', function (e) {
    e.preventDefault();
    var email = $('#subscribe-email').val();
    var token = grecaptcha.getResponse();
    var subscribeUrl = $(this).data('subscribe-url');

    $.ajax({
        url: subscribeUrl,
        type: 'POST',
        headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val() },
        mode: 'same-origin',
        data: {
            'email' : email,
            'g-recaptcha-response': token,
        },
        success: function(response) {
            $('#subscribe-email').val('');
            $('#email-error').html('');
            $('#subscribe-message').html('');
            
            if (response.status === 'success') {
                //console.log("success");
                $('#recaptcha-submit').css({
                    'background-color': '#6c757d',
                    'cursor': 'not-allowed'
                }).prop('disabled', true);
                $('#subscribe-message').html(response.message).css('color', 'green'); // Display success message
                emailValid = false;
                recaptchaValid = false;
                var rcAnchorContainer = document.getElementById('captcha-field');
                rcAnchorContainer.style.display = 'none';
                grecaptcha.reset();
                
            } else if (response.status === 'error') {
                    $('#subscribe-message').html(response.message || 'An error occurred. Please try again later.').css('color', 'red');
                    const submitButton = document.getElementById('recaptcha-submit');
                    submitButton.disabled = true;
                    emailValid = false;
                    recaptchaValid = false;
                    grecaptcha.reset();
            }
            
        },
        error: function(response) {
            console.error("Error:", response);
            $('#subscribe-message').html("An error occurred. Please try again later.");
        }
    });
});
