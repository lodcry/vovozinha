package com.vovozinha.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.Rect
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class VovozinhaAccessibilityService : AccessibilityService() {

    companion object {
        var instance: VovozinhaAccessibilityService? = null
    }

    override fun onServiceConnected() {
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {}

    // Clica em nó pelo texto (ex: "Pular anúncio")
    fun clickByText(texts: List<String>): Boolean {
        val root = rootInActiveWindow ?: return false
        for (text in texts) {
            val nodes = root.findAccessibilityNodeInfosByText(text)
            if (nodes.isNotEmpty()) {
                val node = nodes[0]
                if (node.isClickable) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                } else {
                    // sobe na árvore até achar clicável
                    var parent = node.parent
                    while (parent != null) {
                        if (parent.isClickable) {
                            parent.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                            return true
                        }
                        parent = parent.parent
                    }
                }
                return true
            }
        }
        return false
    }

    // Clica no X / botão de fechar mais próximo
    fun clickClose(): Boolean {
        val closeTexts = listOf("✕", "×", "Close", "Fechar", "X")
        if (clickByText(closeTexts)) return true

        // Tenta pelo content-description
        val root = rootInActiveWindow ?: return false
        val queue = ArrayDeque<AccessibilityNodeInfo>()
        queue.add(root)
        while (queue.isNotEmpty()) {
            val node = queue.removeFirst()
            val desc = node.contentDescription?.toString()?.lowercase() ?: ""
            if (desc.contains("close") || desc.contains("fechar") || desc.contains("dismiss")) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return true
            }
            for (i in 0 until node.childCount) {
                node.getChild(i)?.let { queue.add(it) }
            }
        }
        return false
    }

    // Scroll via gesto
    fun scroll(direction: String) {
        val display = resources.displayMetrics
        val w = display.widthPixels.toFloat()
        val h = display.heightPixels.toFloat()

        val path = Path()
        if (direction == "down") {
            path.moveTo(w / 2, h * 0.7f)
            path.lineTo(w / 2, h * 0.3f)
        } else {
            path.moveTo(w / 2, h * 0.3f)
            path.lineTo(w / 2, h * 0.7f)
        }

        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 400))
            .build()

        dispatchGesture(gesture, null, null)
    }

    // Toca em coordenada específica
    fun tap(x: Float, y: Float) {
        val path = Path().apply { moveTo(x, y) }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 50))
            .build()
        dispatchGesture(gesture, null, null)
    }

    // Play/Pause — toca no centro da tela (YouTube player)
    fun clickPlayPause(): Boolean {
        val display = resources.displayMetrics
        tap(display.widthPixels / 2f, display.heightPixels / 2f)
        return true
    }

    // Volta 10s — toca no terço esquerdo do player
    fun seekBackward(): Boolean {
        val display = resources.displayMetrics
        tap(display.widthPixels * 0.25f, display.heightPixels / 2f)
        return true
    }

    // Avança 10s — toca no terço direito do player
    fun seekForward(): Boolean {
        val display = resources.displayMetrics
        tap(display.widthPixels * 0.75f, display.heightPixels / 2f)
        return true
    }

    fun pressBack() {
        performGlobalAction(GLOBAL_ACTION_BACK)
    }

    fun pressHome() {
        performGlobalAction(GLOBAL_ACTION_HOME)
    }

    // Lê títulos de vídeo visíveis na tela
    fun getVideoTitles(): List<String> {
        val root = rootInActiveWindow ?: return emptyList()
        val results = mutableListOf<String>()
        val queue = ArrayDeque<AccessibilityNodeInfo>()
        queue.add(root)
        while (queue.isNotEmpty() && results.size < 8) {
            val node = queue.removeFirst()
            val text = node.text?.toString() ?: ""
            if (text.length > 10 && !text.contains("http") && node.className?.contains("TextView") == true) {
                results.add(text)
            }
            for (i in 0 until node.childCount) {
                node.getChild(i)?.let { queue.add(it) }
            }
        }
        return results
    }

    // Clica no n-ésimo item clicável de vídeo na tela
    fun clickVideoByIndex(index: Int): Boolean {
        val root = rootInActiveWindow ?: return false
        val clickableNodes = mutableListOf<AccessibilityNodeInfo>()
        val queue = ArrayDeque<AccessibilityNodeInfo>()
        queue.add(root)
        while (queue.isNotEmpty()) {
            val node = queue.removeFirst()
            if (node.isClickable && node.childCount > 0) {
                clickableNodes.add(node)
            }
            for (i in 0 until node.childCount) {
                node.getChild(i)?.let { queue.add(it) }
            }
        }
        return if (index < clickableNodes.size) {
            clickableNodes[index].performAction(AccessibilityNodeInfo.ACTION_CLICK)
            true
        } else false
    }
}
