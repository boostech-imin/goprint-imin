<?php
class PrintHelper
{
    public static function renderHead(string $title, string $extraHead = ''): void
    {
        echo "<!doctype html>\n";
        echo "<html lang=\"id\">\n";
        echo "<head>\n";
        echo "  <meta charset=\"utf-8\" />\n";
        echo "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n";
        echo "  <title>" . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . "</title>\n";
        echo "  <link rel=\"stylesheet\" href=\"assets/css/basic.css\" />\n";
        if ($extraHead !== '') {
            echo $extraHead . "\n";
        }
        echo "</head>\n";
        echo "<body>\n";
    }

    public static function renderNav(string $active): void
    {
        $links = [
            'Demo Antrian' => 'demoAntrian.php',
            'Demo QR' => 'demoQR.php',
            'Demo Struck' => 'demoStruck.php'
        ];

        echo "  <nav class=\"nav\">\n";
        foreach ($links as $label => $href) {
            $isActive = $label === $active ? ' active' : '';
            echo "    <a class=\"nav-link{$isActive}\" href=\"{$href}\">{$label}</a>\n";
        }
        echo "  </nav>\n\n";
    }

    public static function renderFooter(string $label): void
    {
        echo "  <footer class=\"footer\">\n";
        echo "    <span>" . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . "</span>\n";
        echo "    <span id=\"yearNow\"></span>\n";
        echo "  </footer>\n\n";
    }

    public static function renderPrintSink(): void
    {
        echo "  <iframe id=\"printSink\" class=\"print-sink\"></iframe>\n\n";
    }

    public static function renderDocs(string $type, string $scriptName): void
    {
        $content = '';

        if ($type === 'qr') {
            $content = "1) Load library print\n" .
                "<script src=\"assets/js/printCommon.js\"></script>\n\n" .
                "2) Library QR wajib di-load sebelum demo QR\n" .
                "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js\"></script>\n\n" .
                "3) Harus ada iframe sebagai print sink\n" .
                "<iframe id=\"printSink\" class=\"print-sink\"></iframe>\n\n" .
                "4) Payload print berisi COMMANDS.QR()\n" .
                "const printer = new PrintLib();\n" .
                "const commandParts = [\n" .
                "  \"COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT\",\n" .
                "  `COMMANDS.QR(\\\"\\${currentCode}\\\", { align: \\\"CENTER\\\", moduleSize: 6, margin: 4, ecc: \\\"M\\\" })`\n" .
                "];\n\n" .
                "5) Kirim ke iframe lalu panggil print()\n" .
                "printer.printParts(commandParts);\n\n" .
                "6) Urutan script demo\n" .
                "<script src=\"assets/js/" . $scriptName . "\"></script>";
        } else {
            $content = "1) Load library print\n" .
                "<script src=\"assets/js/printCommon.js\"></script>\n\n" .
                "2) Harus ada iframe sebagai print sink\n" .
                "<iframe id=\"printSink\" class=\"print-sink\"></iframe>\n\n" .
                "3) Payload print berupa daftar commandParts (string)\n" .
                "const printer = new PrintLib();\n" .
                "const commandParts = [\n" .
                "  \"COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT\",\n" .
                "  PrintLib.wrap(\\\"NOMOR ANTRIAN\\\\n\\\")\n" .
                "];\n\n" .
                "4) Kirim ke iframe lalu panggil print()\n" .
                "printer.printParts(commandParts);\n\n" .
                "5) Urutan script demo\n" .
                "<script src=\"assets/js/" . $scriptName . "\"></script>";
        }

        echo "    <section class=\"card\">\n";
        echo "      <h2>Dokumentasi untuk Programmer</h2>\n";
        echo "      <p>Hal penting supaya demo bisa dimuat dan diprint:</p>\n";
        echo "      <pre><code>" . htmlspecialchars($content, ENT_QUOTES, 'UTF-8') . "</code></pre>\n";
        if ($type === 'qr') {
            echo "      <p>Catatan: QR di browser hanya preview. Printer menggunakan perintah COMMANDS.QR() saat print.</p>\n";
        } else {
            echo "      <p>Catatan: commandParts wajib mengikuti format helper COMMANDS milik IMIN Go-Print.</p>\n";
        }
        echo "    </section>\n";
    }
}
