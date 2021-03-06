@import "MochaJSDelegate.js";

const SPIRAL_CONSTANTS = {
  SPIRAL_TYPE_ARCHIMEDEAN: 0,
  SPIRAL_TYPE_LOGARITHIMIC: 1
};

var debugMode = false;

var doc;
var selectedLayers;
var selectedCount;
var layer;
var layer2;
var spiralObjectID;
var currentPage;
var pageLayers;
var panel;

var data;

var pluginChangedSelection = false;

function onRun(context) {
  doc = context.document;
  selectedLayers = context.selection;
  selectedCount = selectedLayers.count();
  currentPage = doc.currentPage();
  pageLayers = currentPage.layers();

  sendEvent(context, 'Plugin Started', 'onRun function');

  var panelWidth = 400; // original 80
  var panelHeight = 700; // original 240

  // Create an NSThread dictionary with a specific identifier
  var threadDictionary = NSThread.mainThread().threadDictionary();
  //   var identifier = "co.awkward.floatingexample";
  var identifier = "design.matej.6spiral";

  // If there's already a panel, prevent the plugin from running
  if (threadDictionary[identifier]) return;

  // Create the panel and set its appearance
  panel = NSPanel.alloc().init();
  panel.setFrame_display(NSMakeRect(0, 0, panelWidth, panelHeight), true);
  panel.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask);
  panel.setBackgroundColor(NSColor.whiteColor());

  // Set the panel's title and title bar appearance
  panel.title = "🌀6Spiral";
  panel.titlebarAppearsTransparent = true;

  // Center and focus the panel
  panel.center();
  panel.makeKeyAndOrderFront(null);
  panel.becomeKeyWindow();
  panel.setLevel(NSFloatingWindowLevel);

  // Make the plugin's code stick around (since it's a floating panel)
  COScript.currentCOScript().setShouldKeepAround_(true);

  // Hide the Minimize and Zoom button
  panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  panel.standardWindowButton(NSWindowZoomButton).setHidden(true);

  // Create the blurred background
  var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
  vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
  vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

  // Create the WebView with a request to a Web page in Contents/Resources/
  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight - 44));
  var request = NSURLRequest.requestWithURL(context.plugin.urlForResourceNamed("webView.html"));
  webView.mainFrame().loadRequest(request);
  // Commented out. Unsure, but may cause issue for using Right Click -> Inspect Element
  // webView.setDrawsBackground(false);

  // Access the Web page's JavaScript environment
  var windowObject = webView.windowScriptObject();

  if(selectedCount != 0) {
    layer = selectedLayers[0];
  }

  // Create the delegate
  var delegate = new MochaJSDelegate({

    // Listen to URL changes
    "webView:didChangeLocationWithinPageForFrame:": (function(webView, webFrame) {

      // Extract the URL hash (without #) by executing JavaScript in the Web page
      var hash = windowObject.evaluateWebScript("window.location.hash.substring(1)");

      // Parse the hash's JSON content
      data = JSON.parse(hash);
      superDebug("DATA", data);
      superDebug("DATA", JSON.stringify(data));

      if (data.hasOwnProperty('link')) {
        openURL(data.link);
      }
      else if (data.hasOwnProperty('close')) {
        panel.close();
        // Remove the reference to the panel
        threadDictionary.removeObjectForKey(identifier);
        // Stop the plugin
        COScript.currentCOScript().setShouldKeepAround_(false);
      }
      else if (data.hasOwnProperty('spiral')) {
        // Make a SPIRAL.
        superDebug("PRESSED MAKE SPIRAL BUTTON", " ");
        superDebug("selectedLayers", selectedLayers);
        superDebug("selectedCount", selectedCount);
        superDebug("contentDrawView", context.document.contentDrawView());

        if(selectedCount != 0) {
            superDebug("Layer", layer);
            superDebug("Layer", layer.toString());
            //check that this layer is a shape
            if (isAllowedShape(layer)) {
              superDebug("VALID SHAPE DETECTED IN INTIAL CALL");

              // layer.select_byExtendingSelection(true, false);

              superDebug("addSpiral layer ", layer);
              addSpiral(layer, data);
              pageLayers = currentPage.layers();
      
              //group and name new group
              // superDebug("STARTED MAKING GROUP", " ");
              // var groupAction = doc.actionsController().actionForID("MSGroupAction");
              // groupAction.group(nil);
              // gr = layer.parentGroup();
              // gr.setName('Spiral Group');
              // superDebug("FINISHED MAKING GROUP", " ");
        
            } else {
              superDebug("DIDNT MAKE SPIRAL", " ");
              doc.showMessage("Oops, 🌀6Spiral can't work with current selection.😅 ");
            }
    
        }
      }
      // Send info back to webView.js that Spiral has been made.
      // Moved this function to where we detect if selection was changed by the plugin.
      // windowObject.evaluateWebScript("drawingSpiralCompleted()");
    })
  })

  // Set the delegate on the WebView
  webView.setFrameLoadDelegate_(delegate.getClassInstance());

  // Add the content views to the panel
  panel.contentView().addSubview(vibrancy);
  panel.contentView().addSubview(webView);

  // After creating the panel, store a reference to it
  threadDictionary[identifier] = panel;

  var closeButton = panel.standardWindowButton(NSWindowCloseButton);

  // Assign a function to the Close button
  closeButton.setCOSJSTargetFunction(function(sender) {
    panel.close();

    // Remove the reference to the panel
    threadDictionary.removeObjectForKey(identifier);

    // Stop the plugin
    COScript.currentCOScript().setShouldKeepAround_(false);
  });
}


function addSpiral(layer, data) {
  superDebug("Started addSpiral", " ");

  if(spiralObjectID) {
    if(spiralObjectID.toString() == layer2.objectID().toString()) {
      superDebug("LAYER MATCHES PREVIOUS", " ");
      layer2.removeFromParent();
    } else {
      superDebug("SAVED SPIRAL ID", spiralObjectID.toString());
      superDebug("CURRENT LAYER ID", layer.objectID().toString());
    }
  }
  var currentSpiralType = parseInt(data.currentSpiralType);
  var innerR = parseInt(data.innerRadius);
  if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
    innerR = Math.max(innerR, 1.0);
  }
  var outerR = parseInt(data.outerRadius);
  if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {
    outerR = Math.max(outerR, 1.0);
  }
  
  // Inner and Outer Radius also can't both be 0 for archimedean spiral.
  // Setting both to 0 erases the shape and plugin needs to be restarted.
  // Forcing outerR to 1.0 if both InnerR and outerR are set to 0 to prevent this issue.
  if(innerR == 0 && outerR == 0) {
      outerR = 1.0;
  }

  var degrees = Math.max(parseInt(data.degrees),1);
  var points = Math.max(parseInt(data.points), 2);
  var lineWidth = parseFloat(data.lineWidth);

  var shouldMakeHelix = data.shouldMakeHelix;
  var shouldAdjustHelixHeight = data.shouldAdjustHelixHeight;
  var helixOffsetX = parseFloat(data.helixOffsetX);
  var helixOffsetY = parseFloat(data.helixOffsetY);
  var helixHWRatio = parseFloat(data.helixHWRatio);
  var helixIsoAngle = parseFloat(data.helixIsoAngle);
  superDebug("helixHWRatio", helixHWRatio);

  if (shouldAdjustHelixHeight) {
    helixOffsetY = helixOffsetY * Math.sin(helixIsoAngle * (Math.PI / 180));
  }

  var helixPointOffsetX = helixOffsetX/points;
  var helixPointOffsetY = helixOffsetY/points;

  var pointDistanceIncrement = (outerR - innerR)/(points);

  superDebug("Making Spiral", " ");
  superDebug("innerRadius", data.innerRadius);
  superDebug("outerRadius", data.outerRadius);
  superDebug("shouldMakeHelix", shouldMakeHelix); 
  superDebug("helixPointOffsetY", helixPointOffsetY); 

  var spiralPath = NSBezierPath.bezierPath();
  spiralPath.moveToPoint(NSMakePoint(0, 0));

  if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_ARCHIMEDEAN) {
    for (var i = 0; i <= points; i++) {

      var pointLength = innerR + i * pointDistanceIncrement;
      superDebug("pointLength", pointLength);
  
      // var zigZag = false;
      // var lengthChange = 0;
      // if (zigZag) {
      //   var lengthChange = pointLength / 10;
      //   if (i % 2 == 1) {
      //     lengthChange = -pointLength / 10;
      //   }
      // }
      // var centerToPointLength = Math.sqrt(pointX*pointX+pointY*pointY); // length is defined.
      // var centerToPointNormalVectorX = pointX / centerToPointLength;
      // var centerToPointNormalVectorY = pointY / centerToPointLength;
  
      var pointAngle = i * (degrees/points);
      var pointX = pointLength * Math.cos(pointAngle * (Math.PI / 180));
      var pointY = pointLength * Math.sin(pointAngle * (Math.PI / 180));
      superDebug('Point X: ' + pointX + ' Point Y: ' + pointY, " ");
      superDebug('pointLength', pointLength);
  
      if(shouldMakeHelix) {
        pointY = pointY * helixHWRatio;
        pointY = pointY + i * helixPointOffsetY;
        pointX = pointX + i * helixPointOffsetX;
      }
      spiralPath.lineToPoint(NSMakePoint(pointX, pointY));
    }
  } else if (currentSpiralType == SPIRAL_CONSTANTS.SPIRAL_TYPE_LOGARITHIMIC) {

    // For Log Spiral, inner radius can't be 0 (log spiral only approaches, never reaches 0). 
    var a_log = innerR;
    var b_log = (Math.log(outerR/innerR))/(2*Math.PI*(degrees/360.0));
    var degrees_per_point_log = degrees/points;
    var radians_per_point_log = degrees_per_point_log * (Math.PI/180);

    for (var i = 0; i <= points; i++) {
      var pointAngleDeg = i * degrees_per_point_log;
      var pointAngleRad = i * radians_per_point_log;
      var pointLength =  a_log * Math.pow(Math.E, b_log*pointAngleRad);
      var pointX = pointLength * Math.cos(pointAngleDeg * (Math.PI / 180));
      var pointY = pointLength * Math.sin(pointAngleDeg * (Math.PI / 180));

      if(shouldMakeHelix) {
        pointY = pointY * helixHWRatio;
        pointY = pointY + i * helixPointOffsetY;
        pointX = pointX + i * helixPointOffsetX;
      }

      spiralPath.lineToPoint(NSMakePoint(pointX, pointY));
    }
  }

//            a    *            e ^   (b         *  theta)
//console.log(10 * Math.pow(Math.E, 0.2443118663 * (10*(Math.PI/180))) );

  //spiralPath.closePath();
  spiralPath = MSPath.pathWithBezierPath(spiralPath);
  var spiralShape = MSShapeGroup.layerWithPath(spiralPath);

  spiralObjectID = spiralShape.objectID();
  superDebug("Set SPIRAL OBJECT ID", typeof spiralObjectID);
  superDebug("Set SPIRAL OBJECT ID", spiralObjectID.toString());

  // spiralShape.frame().setWidth(Math.floor(spiralShape.frame().width()));
  // spiralShape.frame().setHeight(Math.floor(spiralShape.frame().height()));

  //color same as line
  // var fill = spiralShape.style().addStylePartOfType(0);
  // fill.setFillType(0);
  // var fills = spiralShape.style().enabledFills();
  // fills.lastObject().setColor(layer.style().borders().firstObject().color());

  var border = spiralShape.style().addStylePartOfType(1);
  border.color = MSImmutableColor.colorWithSVGString("#979797");
  border.thickness = lineWidth;

  //add to layer
  spiralShape.setName('SPIRALshape');
  var gr = layer.parentGroup();
  var grFrame = gr.frame();

  superDebug("grFrame", grFrame.toString());

  spiralShape.frame().x = spiralShape.frame().x() + (layer.frame().x() + (layer.frame().width()/2.0));
  spiralShape.frame().y = spiralShape.frame().y() + (layer.frame().y() + (layer.frame().height()/2.0));

  gr.addLayers([spiralShape]);
  // spiralShape.select_byExtendingSelection(true, true);
  pluginChangedSelection = true;
  spiralShape.select_byExtendingSelection(true, true);

  superDebug("Completed Making Spiral", "");
}

// FUNCTION THAT RUNS EACH TIME SELECTION IS CHANGED WHILE PLUGIN IS RUNNING.
// FUNCTION RUNS BOTH WHEN PLUGIN CHANGES SELECTION AND WHEN USER CHANGES IT.
var onSelectionChanged = function(context) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "design.matej.6spiral";

  // Check if there's a panel opened or not
  if (threadDictionary[identifier]) {
    var panel = threadDictionary[identifier];

    // Access the panel from the reference and the WebView
    var webView = panel.contentView().subviews()[1];
    var windowObject = webView.windowScriptObject();

    var selection = context.actionContext.document.selectedLayers().layers();
    selectedCount = selection.length;
    superDebug("onSelectionChanged selection", selection.toString());

    if(selectedCount != 0) {
      layer = selection[0];
      superDebug("LAYER", layer.toString());
      superDebug("onSelectionChanged frame", selection[0].frame().toString());
      //check that this layer is a shape
      if (isAllowedShape(layer)) {
        superDebug("onSelectionChanged isAllowedShape allowed shape passed", " ");

        // Calling AddSpiral - infinite loop, as addSpiral() changes the selection, which is this function.
        // --> Specifically calling >> spiralShape.select_byExtendingSelection(true, true); may triger this function.
        // Need to use flags to destinguish when onSelectionChanged is due to user or due to the plugin - addSpiral(). - DONE - added pluginChangedSelection
        // Also, need to make flag for case when would want run addSpiral once automatically to center spiral because user changed the selction.
        // ^ If would want to center spiral immediatelly on change of user selection.
        // addSpiral(layer, data);
        // context.actionContext.document.showMessage('Spiral will be centered on selected shape with next change.');

        if (pluginChangedSelection) {
            //context.actionContext.document.showMessage('Selection Changed By Plugin.');
            pluginChangedSelection = false;
            // Sending back info to webView.js that plugin has finished drawing.
            windowObject.evaluateWebScript("drawingSpiralCompleted()");
        } else {
            context.actionContext.document.showMessage('Spiral origin will be centered on selected shape with next change.');
        }
  
      } else {
        superDebug("NOT FOUND onSelectionChanged SHAPE NOT VALID", " ");
        context.actionContext.document.showMessage('Oops. To run 🌀6Spiral you need to select a shape.');
      }
    }
    if(selectedCount == 2) {
      layer2 =selection[1];
      superDebug("LAYER2", layer2.toString());
    }
  }
};

// CHECKING FOR ALL KINDS OF VALID SHAPES
function isAllowedShape(layer) {
  // some checks are redundant. Will return true for MSArtboardGroup regardless if checking specifically for the class. Is probably subclass of other class. Same for MSRectangleShape, etc.
 return (layer && ( layer.isKindOfClass(MSShapePathLayer) || layer.isKindOfClass(MSRectangleShape) || layer.isKindOfClass(MSOvalShape) || layer.isKindOfClass(MSTriangleShape) || layer.isKindOfClass(MSShapeGroup)  || layer.isKindOfClass(MSLayerGroup) || layer.isKindOfClass(MSArtboardGroup)  ));
}

// OPENING LINKS FROM WEBVIEW
function openURL(url) {
  var nsurl = NSURL.URLWithString(url);
  NSWorkspace.sharedWorkspace().openURL(nsurl)
}


// ANALYTICS
var kUUIDKey = 'google.analytics.uuid'
var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
if (!uuid) {
  uuid = NSUUID.UUID().UUIDString()
  NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
}

function jsonToQueryString(json) {
  return '?' + Object.keys(json).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  }).join('&')
}

var index = function (context, trackingId, hitType, props) {
  var payload = {
    v: 1,
    tid: trackingId,
    ds: 'Sketch%20' + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString"),
    cid: uuid,
    t: hitType,
    an: context.plugin.name(),
    aid: context.plugin.identifier(),
    av: context.plugin.version()
  }
  if (props) {
    Object.keys(props).forEach(function (key) {
      payload[key] = props[key]
    })
  }

  var url = NSURL.URLWithString(
    NSString.stringWithFormat("https://www.google-analytics.com/collect%@", jsonToQueryString(payload))
  )

  if (url) {
    NSURLSession.sharedSession().dataTaskWithURL(url).resume()
  }
}

var key = 'UA-124831510-1';
var sendEvent = function (context, category, action, label) {
  var payload = {};
  payload.ec = category;
  payload.ea = action;
  return index(context, key, 'event', payload);
}

function superDebug(lbl, val) {
  if(debugMode) {
    log("SKETCH 6SPIRAL - " + lbl + ": " + val);  
  }
}