@import "MochaJSDelegate.js";

function onRun(context) {

  var doc = context.document;
  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  var panelWidth = 400; // original 80
  var panelHeight = 800; // original 240

  // Create an NSThread dictionary with a specific identifier
  var threadDictionary = NSThread.mainThread().threadDictionary();
  //   var identifier = "co.awkward.floatingexample";
  var identifier = "design.matej.6spiral";

  // If there's already a panel, prevent the plugin from running
  if (threadDictionary[identifier]) return;

  // Create the panel and set its appearance
  var panel = NSPanel.alloc().init();
  panel.setFrame_display(NSMakeRect(0, 0, panelWidth, panelHeight), true);
  panel.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask);
  panel.setBackgroundColor(NSColor.whiteColor());

  // Set the panel's title and title bar appearance
  panel.title = "🌀6Spiral";
  panel.titlebarAppearsTransparent = true;

  // Center and focus the panel
  panel.center();
  panel.makeKeyAndOrderFront(null);
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
  // Commented out so you can Right Click -> Inspect Element
  // webView.setDrawsBackground(false);

  // Access the Web page's JavaScript environment
  var windowObject = webView.windowScriptObject();

  // Create the delegate
  var delegate = new MochaJSDelegate({

    // Listen to URL changes
    "webView:didChangeLocationWithinPageForFrame:": (function(webView, webFrame) {

      // Extract the URL hash (without #) by executing JavaScript in the Web page
      var hash = windowObject.evaluateWebScript("window.location.hash.substring(1)");

      // Parse the hash's JSON content
      var data = JSON.parse(hash);
      log(data);

      if (data.hasOwnProperty('action')) {
        // Launch a Sketch action and focus the main window
        context.document.actionsController().actionForID(data.action).doPerformAction(null);
        NSApp.mainWindow().makeKeyAndOrderFront(null);
      }

      if (data.hasOwnProperty('spiral')) {
        // Make a SPIRAL.
        log("SPIRAL DEBUG // PRESSED MAKE SPIRAL BUTTON!!!");
        log("SPIRAL DEBUG // " + selectedLayers);
        log("SPIRAL DEBUG // " + selectedCount);
        log("SPIRAL DEBUG // DRAW" + context.document.contentDrawView());
        if(selectedCount != 0) {
            var layer = selectedLayers[0];
            log("SPIRAL DEBUG // " + layer);
            //check that this layer is a shape
            if (layer && layer.isKindOfClass(MSShapeGroup)) {

                layer.select_byExtendingSelection(true, false);

                addSpiral(layer, data);
        
                //group and name new group
                log("SPIRAL DEBUG // STARTED MAKING GROUP");
                // var groupAction = doc.actionsController().actionForID("MSGroupAction");
                // groupAction.group(nil);
                // gr = layer.parentGroup();
                // gr.setName('Spiral Group');

                log("SPIRAL DEBUG // FINISHED MAKING GROUP");
        
            } else {
              log("SPIRAL DEBUG // DIDNT MAKE SPIRAL");
              doc.showMessage('Oops, not a path.😅 ');
            }
    
        }
      }
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

  log("SPIRAL DEBUG // Started addSpiral");

  var innerR = parseInt(data.innerRadius);
  var outerR = parseInt(data.outerRadius);
  var degrees = parseInt(data.degrees);
  var points = parseInt(data.points);

  // final outer R is 93.2 now (50 + 54 * 0.8)
  // (93.2 - 50) / 54
  var pointDistanceIncrement = (outerR - innerR)/(points);

  log("SPIRAL DEBUG // Making Spiral");
  log("SPIRAL DEBUG // " + pointDistanceIncrement);
  log("SPIRAL DEBUG // " + data.innerRadius);
  log("SPIRAL DEBUG // " + data.outerRadius);

  var spiralPath = NSBezierPath.bezierPath();
  spiralPath.moveToPoint(NSMakePoint(0, 0));

  for (var i = 0; i <= points; i++) {

    var pointLength = innerR + i * pointDistanceIncrement;
    log('SPIRAL DEBUG // pointLength: ' + pointLength);

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
    pointLength = pointLength;
    var pointX = pointLength * Math.cos(pointAngle * (Math.PI / 180));
    var pointY = pointLength * Math.sin(pointAngle * (Math.PI / 180));
    log('SPIRAL DEBUG // Point X: ' + pointX + ' Point Y: ' + pointY);
    log('SPIRAL DEBUG // pointLength: ' + pointLength);

    spiralPath.lineToPoint(NSMakePoint(pointX, pointY));
  }
  //spiralPath.closePath();
  spiralPath = MSPath.pathWithBezierPath(spiralPath);
  var spiralShape = MSShapeGroup.shapeWithBezierPath(spiralPath);


  var lineThickness = layer.style().borders().objectAtIndex(0).thickness();
  var scale = 1 + (lineThickness / 5);
  // spiralShape.frame().setWidth(Math.floor(spiralShape.frame().width() * scale));
  // spiralShape.frame().setHeight(Math.floor(spiralShape.frame().height() * scale));

  //color same as line
  // var fill = spiralShape.style().addStylePartOfType(0);
  // fill.setFillType(0);
  // var fills = spiralShape.style().enabledFills();
  // fills.lastObject().setColor(layer.style().borders().firstObject().color());

  var border = spiralShape.style().addStylePartOfType(1);
  border.color = MSImmutableColor.colorWithSVGString("#979797");

  //add to layer
  spiralShape.setName('SPIRALshape');
  var gr = layer.parentGroup();
  var grFrame = gr.frame();

  log("SPIRAL DEBUG // gr " + gr.toString());
  log("SPIRAL DEBUG // grFrame " + grFrame.toString());
  log("SPIRAL DEBUG // layerFrame " + layer.frame().toString());
  log("SPIRAL DEBUG // spiralFrame " + spiralShape.frame().toString());
  log("SPIRAL DEBUG // spiralFrame " + spiralShape.frame().x().toString());
  log("SPIRAL DEBUG // spiralFrame " + spiralShape.frame().y().toString());
  log("SPIRAL DEBUG // spiralFrame " + spiralShape.frame().width().toString());
  log("SPIRAL DEBUG // spiralFrame " + spiralShape.frame().height().toString());
  log("SPIRAL DEBUG // spiralFrame height " + typeof spiralShape.frame().height());
  log("SPIRAL DEBUG // spiralFrame width " + typeof spiralShape.frame().width());
  log("SPIRAL DEBUG // spiralFrame x is " + typeof spiralShape.frame().x());
  log("SPIRAL DEBUG // spiralFrame y is " + typeof spiralShape.frame().y());

  var testX =  spiralShape.frame().height();
  log("SPIRAL DEBUG // test X " + testX.toString());
  var testX =  spiralShape.frame().x();
  log("SPIRAL DEBUG // test X " + testX.toString());
  var testX =  spiralShape.frame().y();
  log("SPIRAL DEBUG // test X " + testX.toString());

  
  var finalX = (layer.frame().x() + (layer.frame().width()/2.0)) - (spiralShape.frame().width()/2.0);
  var finalY = (layer.frame().y() + (layer.frame().height()/2.0)) - (spiralShape.frame().height()/2.0);

  log("SPIRAL DEBUG // final X " + finalX.toString());
  log("SPIRAL DEBUG // final Y " + finalY.toString());

  // spiralShape.frame().x = 100.25;
  // spiralShape.frame().y = 100.25;
  spiralShape.frame().x = (layer.frame().x() + (layer.frame().width()/2.0)) + (spiralShape.frame().x());
  spiralShape.frame().y = (layer.frame().y() + (layer.frame().height()/2.0)) + (spiralShape.frame().y());

  gr.addLayers([spiralShape]);
  spiralShape.select_byExtendingSelection(true, true);

  log("SPIRAL DEBUG // Completed Making Spiral")
}

var onSelectionChanged = function(context) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "design.matej.6spiral";

  // Check if there's a panel opened or not
  if (threadDictionary[identifier]) {
    var panel = threadDictionary[identifier];

    // Access the panel from the reference and the WebView
    var webView = panel.contentView().subviews()[1];
    var windowObject = webView.windowScriptObject();

    // Get the current selection and update the CSS preview accordingly
    var selection = context.actionContext.document.selectedLayers().layers();
    if (selection.length == 1) {
      windowObject.evaluateWebScript("updatePreview('" + selection[0].CSSAttributes().join(" ") + "')");
    } else {
      windowObject.evaluateWebScript("updatePreview(' ')");
    }
  }
};
