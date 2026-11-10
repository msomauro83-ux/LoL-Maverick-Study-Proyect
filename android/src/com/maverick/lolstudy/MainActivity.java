package com.maverick.lolstudy;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** Standalone offline study notebook. No network or storage permissions. */
public class MainActivity extends Activity {
  private static final int SAVE_TEXT = 12;
  private WebView web;
  private String pendingText;

  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    getWindow().setStatusBarColor(Color.rgb(17,26,28));
    getWindow().setNavigationBarColor(Color.rgb(20,32,35));
    web = new WebView(this);
    web.setBackgroundColor(Color.rgb(16,23,25));
    web.getSettings().setJavaScriptEnabled(true);
    web.getSettings().setDomStorageEnabled(true);
    web.getSettings().setAllowFileAccess(false);
    web.getSettings().setAllowContentAccess(false);
    web.getSettings().setAllowFileAccessFromFileURLs(false);
    web.getSettings().setAllowUniversalAccessFromFileURLs(false);
    web.getSettings().setTextZoom(100);
    web.addJavascriptInterface(new TextExport(), "Android");
    web.setWebViewClient(new WebViewClient() {
      @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        Uri uri = request.getUrl();
        if ("file".equals(uri.getScheme()) && uri.toString().startsWith("file:///android_asset/")) return false;
        if ("https".equals(uri.getScheme())) {
          try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
          catch (Exception ignored) { Toast.makeText(MainActivity.this, "No hay un navegador disponible", Toast.LENGTH_SHORT).show(); }
        }
        return true;
      }
    });
    // API 35 edge-to-edge: retain safe content area on recent Android devices.
    if (android.os.Build.VERSION.SDK_INT >= 30) {
      web.setOnApplyWindowInsetsListener((view, insets) -> {
        android.graphics.Insets bars = insets.getInsets(android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.ime());
        view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
        return insets;
      });
    }
    setContentView(web);
    web.loadUrl("file:///android_asset/index.html");
  }

  public final class TextExport {
    @JavascriptInterface public void exportText(String filename, String text) {
      if (text == null || text.length() > 5000000) return;
      final String safeName = filename.replaceAll("[^a-zA-Z0-9_.-]", "_");
      runOnUiThread(() -> {
        pendingText = text;
        Intent save = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        save.addCategory(Intent.CATEGORY_OPENABLE);
        save.setType("text/plain");
        save.putExtra(Intent.EXTRA_TITLE, safeName);
        try { startActivityForResult(save, SAVE_TEXT); }
        catch (Exception ignored) { pendingText = null; Toast.makeText(MainActivity.this, "No se pudo abrir el selector de archivos", Toast.LENGTH_LONG).show(); }
      });
    }
  }

  @Override protected void onActivityResult(int request, int result, Intent data) {
    super.onActivityResult(request, result, data);
    if (request != SAVE_TEXT) return;
    if (result == RESULT_OK && data != null && data.getData() != null && pendingText != null) {
      try (OutputStream output = getContentResolver().openOutputStream(data.getData())) {
        if (output == null) throw new java.io.IOException("No output stream");
        output.write(("\uFEFF" + pendingText).getBytes(StandardCharsets.UTF_8));
        Toast.makeText(this, "Archivo de texto guardado", Toast.LENGTH_SHORT).show();
      } catch (Exception ignored) { Toast.makeText(this, "No se pudo guardar el archivo", Toast.LENGTH_LONG).show(); }
    }
    pendingText = null;
  }

  @Override public void onBackPressed() {
    web.evaluateJavascript("window.maverickBack ? window.maverickBack() : false", handled -> {
      if (!"true".equals(handled)) finish();
    });
  }

  @Override protected void onDestroy() {
    if (web != null) { web.removeJavascriptInterface("Android"); web.destroy(); }
    super.onDestroy();
  }
}
