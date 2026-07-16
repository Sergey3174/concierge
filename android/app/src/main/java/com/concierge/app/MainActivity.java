package com.concierge.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WebSettings settings = getBridge().getWebView().getSettings();

    settings.setSupportZoom(false);
    settings.setBuiltInZoomControls(false);
    settings.setDisplayZoomControls(false);

    
    settings.setTextZoom(100);
    settings.setUseWideViewPort(false);
    settings.setLoadWithOverviewMode(false);
    
  }
}
