export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
}

export interface DocItem {
  id: string;
  title: string;
  description: string;
  syntax: string;
  examples: CodeExample[];
  notes?: string;
}

export interface DocSection {
  id: string;
  title: string;
  description: string;
  items: DocItem[];
}

export const documentation: DocSection[] = [
  {
    id: 'basics',
    title: 'WebDriver Basics',
    description: 'Konsep fundamental dan setup awal untuk Selenium WebDriver automation.',
    items: [
      {
        id: 'implicit-wait',
        title: 'Implicit Wait',
        description: 'Implicit Wait adalah mekanisme untuk menunggu elemen muncul sebelum throwing NoSuchElementException. Waktu tunggu berlaku secara global untuk SEMUA perintah findElement dalam lifecycle instance driver. Jika elemen ditemukan sebelum waktu habis, script langsung melanjutkan. Waktu tunggu default adalah 0 detik dan bisa dikonfigurasi sesuai kebutuhan aplikasi Anda.',
        syntax: `driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
// atau di Java 8 ke atas:
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`,
        examples: [
          {
            title: 'Setup Implicit Wait',
            description: 'Menetapkan implicit wait untuk 10 detik di BeforeClass sehingga berlaku untuk semua test method',
            code: `@BeforeClass
public static void setup() {
    WebDriverManager.chromedriver().setup();
    driver = new ChromeDriver();
    
    // Implicit wait untuk semua elemen - berlaku global
    driver.manage().timeouts()
        .implicitlyWait(Duration.ofSeconds(10));
    
    test.info("✓ Implicit wait set to 10 seconds");
}

@Test
public void testImplicitWait() {
    test = extent.createTest("Implicit Wait Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // Akan menunggu maksimal 10 detik sampai element ditemukan
        WebElement searchBox = driver.findElement(By.name("q"));
        assertTrue("Search box should be found", searchBox != null);
        test.pass("✓ Element ditemukan dalam 10 detik");
        
        searchBox.sendKeys("Selenium WebDriver");
        test.pass("✓ Text berhasil dimasukkan");
        
    } catch (NoSuchElementException e) {
        test.fail("Element tidak ditemukan setelah 10 detik: " + e.getMessage());
    } catch (Exception e) {
        test.fail("Test gagal: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
        notes: '⚠️ PENTING: Implicit wait berlaku global untuk SEMUA findElement calls. Jika waktu habis untuk setiap element yang tidak ditemukan, test akan lebih lambat. Hindari mencampur implicit wait dengan explicit wait karena akan mengalikan waktu tunggu total.',
      },
      {
        id: 'explicit-wait',
        title: 'Explicit Wait (WebDriverWait)',
        description: 'Explicit Wait adalah cara yang lebih powerful dan recommended untuk menunggu elemen dengan kondisi spesifik. Berbeda dengan implicit wait yang menunggu elemen ada di DOM, explicit wait dapat menunggu berbagai kondisi seperti element visible, clickable, presence, dll. Anda dapat mendefinisikan kondisi custom dengan lambda expressions dan polling interval yang dapat disesuaikan. Explicit wait OVERRIDE implicit wait ketika digunakan.',
        syntax: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("element"))
);`,
        examples: [
          {
            title: 'Tunggu Element Visible',
            description: 'Menunggu sampai element terlihat (visible) di halaman sebelum berinteraksi',
            code: `@Test
public void testExplicitWaitVisible() {
    test = extent.createTest("Explicit Wait - Visibility Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // Buat WebDriverWait instance dengan timeout 10 detik
        WebDriverWait wait = new WebDriverWait(driver, 
            Duration.ofSeconds(10));
        
        // Tunggu hingga elemen VISIBLE (ada di DOM dan visible di screen)
        WebElement searchBox = wait.until(
            ExpectedConditions
                .visibilityOfElementLocated(By.name("q"))
        );
        
        searchBox.sendKeys("Selenium WebDriver Tutorial");
        test.pass("✓ Search box visible dan text berhasil dimasukkan");
        
    } catch (TimeoutException e) {
        test.fail("Search box tidak muncul dalam 10 detik: " + e.getMessage());
    } catch (Exception e) {
        test.fail("Test gagal: " + e.getMessage());
    }
}`,
            language: 'java',
          },
          {
            title: 'Tunggu Element Clickable',
            description: 'Menunggu sampai element dapat diklik (present, visible, dan enabled)',
            code: `@Test
public void testExplicitWaitClickable() {
    test = extent.createTest("Explicit Wait - Clickable Test");
    
    try {
        driver.navigate().to("https://example.com");
        
        WebDriverWait wait = new WebDriverWait(driver, 
            Duration.ofSeconds(15));
        
        // Tunggu hingga BUTTON dapat diklik
        // Kondisi ini memastikan element present, visible, dan ENABLED
        WebElement submitButton = wait.until(
            ExpectedConditions.elementToBeClickable(By.id("submitBtn"))
        );
        
        submitButton.click();
        test.pass("✓ Submit button clickable dan berhasil diklik");
        
        // Tunggu untuk hasil (contoh: redirect)
        wait.until(ExpectedConditions.urlContains("success"));
        test.pass("✓ Redirected ke halaman success");
        
    } catch (TimeoutException e) {
        test.fail("Element tidak clickable atau tidak ada kondisi yang terpenuhi");
    }
}`,
            language: 'java',
          },
          {
            title: 'Custom Explicit Wait Conditions',
            description: 'Membuat custom waiting condition menggunakan lambda expression',
            code: `@Test
public void testCustomWaitCondition() {
    test = extent.createTest("Custom Wait Condition Test");
    
    try {
        driver.navigate().to("https://example.com");
        
        WebDriverWait wait = new WebDriverWait(driver, 
            Duration.ofSeconds(10));
        
        // Custom condition: tunggu sampai text pada element tertentu berubah
        WebElement statusElement = wait.until(webDriver -> {
            WebElement elem = webDriver.findElement(By.id("status"));
            String text = elem.getText();
            return text.contains("Ready") ? elem : null;
        });
        
        test.pass("✓ Status berubah menjadi 'Ready'");
        
        // Custom condition: tunggu sampai element value tidak kosong
        WebElement inputField = wait.until(webDriver -> {
            WebElement elem = webDriver.findElement(By.id("resultField"));
            String value = elem.getAttribute("value");
            return (value != null && !value.isEmpty()) ? elem : null;
        });
        
        test.pass("✓ Result field terisi dengan data");
        
    } catch (TimeoutException e) {
        test.fail("Custom condition tidak terpenuhi dalam timeout");
    }
}`,
            language: 'java',
          },
        ],
        notes: '💡 BEST PRACTICE: Selalu gunakan Explicit Wait untuk kasus kompleks. Lebih reliable, fleksibel, dan dapat menunggu kondisi spesifik. Hindari implicit wait jika memungkinkan karena dapat memperlambat test. Polling interval default adalah 500ms.',
      },
      {
        id: 'window-management',
        title: 'Window & Frame Management',
        description: 'Mengelola jendela browser dan mengatur ukuran serta posisi window.',
        syntax: `driver.manage().window().maximize();
driver.manage().window().setSize(new Dimension(1024, 768));`,
        examples: [
          {
            title: 'Maximize dan Set Custom Size',
            description: 'Memaksimalkan window kemudian set ukuran custom',
            code: `@Test
public void testWindowManagement() {
    test = extent.createTest("Window Management Test");
    
    try {
        // Maximize window
        driver.manage().window().maximize();
        test.info("Browser window maximized");
        
        // Set custom resolution
        driver.manage().window()
            .setSize(new Dimension(1920, 1080));
        test.pass("Window resized to 1920x1080");
        
        // Get window size
        Dimension size = driver.manage()
            .window().getSize();
        test.info("Current size: " + size);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'cookies-management',
        title: 'Cookies Management',
        description: 'Menambah, mengambil, dan menghapus cookies dari browser.',
        syntax: `Cookie cookie = new Cookie("name", "value");
driver.manage().addCookie(cookie);
driver.manage().deleteCookie(cookie);`,
        examples: [
          {
            title: 'Add, Get, dan Delete Cookie',
            description: 'Manajemen lengkap cookie dalam test',
            code: `@Test
public void testCookieManagement() {
    test = extent.createTest("Cookie Management Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // Add cookie
        Cookie cookie = new Cookie("testCookie", "testValue");
        driver.manage().addCookie(cookie);
        test.pass("Cookie added successfully");
        
        // Get cookie
        Cookie retrievedCookie = driver.manage()
            .getCookieNamed("testCookie");
        assertNotNull("Cookie should exist", retrievedCookie);
        test.pass("Cookie: " + retrievedCookie.getValue());
        
        // Get all cookies
        Set<Cookie> allCookies = driver.manage().getCookies();
        test.info("Total cookies: " + allCookies.size());
        
        // Delete cookie
        driver.manage().deleteCookie(cookie);
        test.pass("Cookie deleted");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'locators-and-interactions',
    title: 'Element Location & Interaction',
    description: 'Strategi menemukan element dan berinteraksi dengan elemen web.',
    items: [
      {
        id: 'locator-strategies',
        title: 'Locator Strategies',
        description: 'Berbagai cara untuk menemukan dan mengidentifikasi elemen di halaman.',
        syntax: `By.id("elementId")
By.name("elementName")
By.cssSelector("input.class")
By.xpath("//input[@id='id']")`,
        examples: [
          {
            title: 'Semua Strategi Locator',
            description: 'Contoh menggunakan berbagai locator strategies',
            code: `@Test
public void testLocatorStrategies() {
    test = extent.createTest("Locator Strategies");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // By ID
        WebElement byId = driver.findElement(By.id("APjFqb"));
        test.pass("✓ Found by ID");
        
        // By Name
        WebElement byName = driver.findElement(By.name("q"));
        test.pass("✓ Found by Name");
        
        // By CSS Selector
        WebElement byCss = driver.findElement(
            By.cssSelector("input[name='q']")
        );
        test.pass("✓ Found by CSS Selector");
        
        // By XPath
        WebElement byXPath = driver.findElement(
            By.xpath("//input[@name='q']")
        );
        test.pass("✓ Found by XPath");
        
        // By Tag Name
        List<WebElement> byTag = driver.findElements(
            By.tagName("input")
        );
        test.pass("✓ Found " + byTag.size() + " by Tag");
        
        // By Class Name
        WebElement byClass = driver.findElement(
            By.className("gLFJ2c")
        );
        test.pass("✓ Found by Class Name");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
        notes: 'ID dan Name adalah locator paling reliable. Gunakan XPath sebagai last resort.',
      },
      {
        id: 'element-interaction',
        title: 'Element Interaction',
        description: 'Berinteraksi dengan elemen web seperti klik, input text, dan mengambil data.',
        syntax: `element.click();
element.sendKeys("text");
element.getText();
element.getAttribute("attr");`,
        examples: [
          {
            title: 'Interaksi Element Lengkap',
            description: 'Klik, input, dan mengambil informasi dari element',
            code: `@Test
public void testElementInteraction() {
    test = extent.createTest("Element Interaction");
    
    try {
        driver.navigate().to("https://www.google.com");
        Thread.sleep(2000);
        
        // Find search box
        WebElement searchBox = driver.findElement(By.name("q"));
        
        // Check if displayed & enabled
        assertTrue("Should be displayed", searchBox.isDisplayed());
        assertTrue("Should be enabled", searchBox.isEnabled());
        test.pass("Element validation passed");
        
        // Send keys (type text)
        searchBox.sendKeys("Selenium WebDriver");
        test.info("Text entered");
        
        // Get element properties
        String tagName = searchBox.getTagName();
        test.pass("Tag: " + tagName);
        
        String ariaLabel = searchBox.getAttribute("aria-label");
        test.pass("Aria-label: " + ariaLabel);
        
        // Get CSS value
        String color = searchBox.getCssValue("color");
        test.info("Color CSS: " + color);
        
        // Get size and location
        Dimension size = searchBox.getSize();
        Point location = searchBox.getLocation();
        test.info("Size: " + size + ", Location: " + location);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'multiple-elements',
        title: 'Multiple Elements',
        description: 'Menemukan dan bekerja dengan multiple elemen dalam satu query.',
        syntax: `List<WebElement> elements = driver.findElements(By.tagName("input"));`,
        examples: [
          {
            title: 'Find dan Iterate Multiple Elements',
            description: 'Mencari semua element dan melakukan iterasi',
            code: `@Test
public void testMultipleElements() {
    test = extent.createTest("Multiple Elements");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // Find all input elements
        List<WebElement> inputs = driver.findElements(
            By.tagName("input")
        );
        test.info("Found " + inputs.size() + " input elements");
        
        // Find all links
        List<WebElement> links = driver.findElements(
            By.tagName("a")
        );
        test.pass("Found " + links.size() + " links");
        
        // Iterate dan collect text
        for (int i = 0; i < links.size() && i < 5; i++) {
            String linkText = links.get(i).getText();
            if (!linkText.isEmpty()) {
                test.info("Link " + i + ": " + linkText);
            }
        }
        
        // Stream API
        links.stream()
            .map(WebElement::getText)
            .filter(text -> !text.isEmpty())
            .limit(3)
            .forEach(text -> test.info("Text: " + text));
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'advanced-waits',
    title: 'Waits & Timeouts',
    description: 'Strategi menunggu element dan kondisi dengan berbagai teknik wait.',
    items: [
      {
        id: 'expected-conditions',
        title: 'Expected Conditions',
        description: 'Kondisi-kondisi yang dapat ditunggu menggunakan WebDriverWait.',
        syntax: `ExpectedConditions.visibilityOfElementLocated()
ExpectedConditions.elementToBeClickable()
ExpectedConditions.presenceOfElementLocated()`,
        examples: [
          {
            title: 'Common Expected Conditions',
            description: 'Contoh penggunaan berbagai Expected Conditions',
            code: `@Test
public void testExpectedConditions() {
    test = extent.createTest("Expected Conditions");
    
    try {
        driver.navigate().to("https://www.google.com");
        WebDriverWait wait = new WebDriverWait(driver, 
            Duration.ofSeconds(10));
        
        // Visibility of element
        WebElement visible = wait.until(
            ExpectedConditions
                .visibilityOfElementLocated(By.name("q"))
        );
        test.pass("✓ Element is visible");
        
        // Element to be clickable
        WebElement clickable = wait.until(
            ExpectedConditions
                .elementToBeClickable(By.name("q"))
        );
        test.pass("✓ Element is clickable");
        
        // Presence of element
        WebElement present = wait.until(
            ExpectedConditions
                .presenceOfElementLocated(By.name("q"))
        );
        test.pass("✓ Element is present in DOM");
        
        // Invisibility of element
        wait.until(
            ExpectedConditions
                .invisibilityOfElementLocated(By.id("loader"))
        );
        test.pass("✓ Loader disappeared");
        
        // Element to be selected
        WebElement checkbox = driver.findElement(By.id("agree"));
        wait.until(ExpectedConditions.elementToBeSelected(checkbox));
        test.pass("✓ Checkbox is selected");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'page-load-wait',
        title: 'Page Load Wait',
        description: 'Menunggu sampai halaman selesai loading sebelum melanjutkan.',
        syntax: `driver.executeScript("return document.readyState").equals("complete")`,
        examples: [
          {
            title: 'Wait untuk Document Ready',
            description: 'Menunggu sampai document.readyState = complete',
            code: `public static void waitForPageLoad(WebDriver driver) {
    WebDriverWait wait = new WebDriverWait(driver, 
        Duration.ofSeconds(10));
    wait.until(webDriver -> 
        ((JavascriptExecutor) webDriver)
            .executeScript("return document.readyState")
            .equals("complete")
    );
}

@Test
public void testPageLoadWait() {
    test = extent.createTest("Page Load Wait");
    
    try {
        driver.navigate().to("https://www.google.com");
        waitForPageLoad(driver);
        test.pass("✓ Page loaded successfully");
        
        String title = driver.getTitle();
        test.info("Page title: " + title);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'browser-capabilities',
    title: 'Browser Capabilities',
    description: 'Konfigurasi dan option untuk menjalankan browser dengan pengaturan khusus.',
    items: [
      {
        id: 'chrome-options',
        title: 'Chrome Options',
        description: 'Berbagai opsi untuk mengkonfigurasi Chrome browser saat startup.',
        syntax: `ChromeOptions options = new ChromeOptions();
options.addArguments("--headless");
driver = new ChromeDriver(options);`,
        examples: [
          {
            title: 'Chrome Options Setup Lengkap',
            description: 'Setup Chrome dengan berbagai options',
            code: `public static WebDriver setupChromeWithOptions() {
    ChromeOptions options = new ChromeOptions();
    
    // Disable notifications
    options.addArguments("--disable-notifications");
    
    // Start maximized
    options.addArguments("--start-maximized");
    
    // Disable extensions
    options.addArguments("--disable-extensions");
    
    // Accept insecure certificates
    options.setAcceptInsecureCerts(true);
    
    // Disable images (faster loading)
    options.addArguments(
        "--blink-settings=imagesEnabled=false"
    );
    
    // Disable browser plugins
    options.addArguments("--disable-plugins");
    
    // Set user agent
    options.addArguments(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    );
    
    // Headless mode (optional)
    // options.addArguments("--headless");
    
    return new ChromeDriver(options);
}

@BeforeClass
public static void setup() {
    WebDriverManager.chromedriver().setup();
    driver = setupChromeWithOptions();
    test.pass("Chrome setup dengan custom options");
}`,
            language: 'java',
          },
        ],
        notes: 'Chrome Options memungkinkan customization mendalam dari behavior browser Selenium.',
      },
    ],
  },
  {
    id: 'advanced-interactions',
    title: 'Advanced Interactions',
    description: 'Teknik interaksi advanced termasuk dropdown, alert, iframe, keyboard, dan mouse actions.',
    items: [
      {
        id: 'dropdown-select',
        title: 'Dropdown/Select Elements',
        description: 'Berinteraksi dengan HTML select elements dan dropdown menus.',
        syntax: `Select select = new Select(element);
select.selectByValue("value");
select.selectByVisibleText("Text");`,
        examples: [
          {
            title: 'Dropdown Selection Operations',
            description: 'Berbagai cara memilih opsi dari dropdown',
            code: `import org.openqa.selenium.support.ui.Select;

@Test
public void testDropdownSelection() {
    test = extent.createTest("Dropdown Selection");
    
    try {
        driver.navigate().to("https://example.com");
        
        // Find dropdown element
        WebElement dropdownElement = driver.findElement(
            By.id("country")
        );
        Select dropdown = new Select(dropdownElement);
        
        // Select by visible text
        dropdown.selectByVisibleText("Indonesia");
        test.pass("✓ Selected by visible text");
        
        // Select by value
        dropdown.selectByValue("id");
        test.pass("✓ Selected by value");
        
        // Select by index
        dropdown.selectByIndex(0);
        test.pass("✓ Selected by index");
        
        // Get selected option
        WebElement selected = dropdown
            .getFirstSelectedOption();
        String selectedText = selected.getText();
        test.info("Selected: " + selectedText);
        
        // Get all options
        List<WebElement> options = dropdown.getOptions();
        test.info("Total options: " + options.size());
        
        // Check if multiple select
        boolean isMultiple = dropdown.isMultiple();
        test.info("Is multiple: " + isMultiple);
        
        if (isMultiple) {
            dropdown.selectByValue("option1");
            dropdown.selectByValue("option2");
            test.pass("✓ Multi-select performed");
        }
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'alert-handling',
        title: 'Alert Handling',
        description: 'Menangani JavaScript alerts, confirms, dan prompts.',
        syntax: `Alert alert = driver.switchTo().alert();
alert.accept();
alert.dismiss();
String text = alert.getText();`,
        examples: [
          {
            title: 'Alert Accept dan Dismiss',
            description: 'Menangani alert dengan menerima dan menolak',
            code: `@Test
public void testAlertHandling() {
    test = extent.createTest("Alert Handling");
    
    try {
        driver.navigate().to("https://example.com");
        
        // Click button yang trigger alert
        driver.findElement(By.id("alertButton")).click();
        
        // Wait for alert presence
        WebDriverWait wait = new WebDriverWait(driver, 
            Duration.ofSeconds(10));
        wait.until(ExpectedConditions.alertIsPresent());
        
        // Switch to alert
        Alert alert = driver.switchTo().alert();
        test.info("✓ Alert appeared");
        
        // Get alert text
        String alertText = alert.getText();
        test.info("Alert text: " + alertText);
        
        // Accept alert (click OK)
        alert.accept();
        test.pass("✓ Alert accepted");
        
        // Untuk confirm (click Cancel)
        driver.findElement(By.id("confirmButton")).click();
        wait.until(ExpectedConditions.alertIsPresent());
        
        Alert confirm = driver.switchTo().alert();
        confirm.dismiss(); // Click Cancel
        test.pass("✓ Confirm dismissed");
        
        // Untuk prompt (send text)
        driver.findElement(By.id("promptButton")).click();
        wait.until(ExpectedConditions.alertIsPresent());
        
        Alert prompt = driver.switchTo().alert();
        prompt.sendKeys("User Input");
        prompt.accept();
        test.pass("✓ Prompt answered");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'iframe-handling',
        title: 'Frame/IFrame Handling',
        description: 'Bekerja dengan frames dan iframes dalam halaman web.',
        syntax: `driver.switchTo().frame(0);
driver.switchTo().frame("frameId");
driver.switchTo().defaultContent();`,
        examples: [
          {
            title: 'Switch Between Frames',
            description: 'Berpindah antar frames dan kembali ke main content',
            code: `@Test
public void testIFrameHandling() {
    test = extent.createTest("IFrame Handling");
    
    try {
        driver.navigate().to("https://example.com");
        
        // Count total frames
        int frameCount = driver.findElements(
            By.tagName("iframe")
        ).size();
        test.info("Total iframes found: " + frameCount);
        
        // Switch to frame by index
        driver.switchTo().frame(0);
        test.info("✓ Switched to frame 0");
        
        // Find element inside frame
        WebElement elementInFrame = driver.findElement(
            By.id("frameElement")
        );
        elementInFrame.click();
        test.pass("✓ Clicked element in frame");
        
        // Switch to frame by ID
        driver.switchTo().defaultContent();
        driver.switchTo().frame("iframeId");
        test.info("✓ Switched to frame by ID");
        
        // Switch to frame by WebElement
        driver.switchTo().defaultContent();
        WebElement frameElement = driver.findElement(
            By.tagName("iframe")
        );
        driver.switchTo().frame(frameElement);
        test.pass("✓ Switched to frame by WebElement");
        
        // Switch back to main content
        driver.switchTo().defaultContent();
        test.pass("✓ Back to main content");
        
        // Switch to parent frame (if nested)
        driver.switchTo().frame(0);
        driver.switchTo().parentFrame();
        test.pass("✓ Switched to parent frame");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'keyboard-actions',
        title: 'Keyboard Actions',
        description: 'Melakukan aksi keyboard seperti TAB, ENTER, copy-paste, dan key combinations.',
        syntax: `Actions actions = new Actions(driver);
actions.sendKeys(Keys.TAB).perform();
actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).perform();`,
        examples: [
          {
            title: 'Keyboard Actions Complete',
            description: 'Berbagai aksi keyboard dan key combinations',
            code: `import org.openqa.selenium.Keys;
import org.openqa.selenium.interactions.Actions;

@Test
public void testKeyboardActions() {
    test = extent.createTest("Keyboard Actions");
    
    try {
        driver.navigate().to("https://example.com");
        Actions actions = new Actions(driver);
        
        // Find input field
        WebElement input = driver.findElement(By.id("input"));
        input.click();
        test.info("✓ Input focused");
        
        // Type text
        input.sendKeys("Hello World");
        test.pass("✓ Text typed");
        
        // Select all (Ctrl+A)
        actions.keyDown(Keys.CONTROL)
            .sendKeys("a")
            .keyUp(Keys.CONTROL)
            .perform();
        test.info("✓ Text selected (Ctrl+A)");
        
        // Copy (Ctrl+C)
        actions.keyDown(Keys.CONTROL)
            .sendKeys("c")
            .keyUp(Keys.CONTROL)
            .perform();
        test.info("✓ Text copied (Ctrl+C)");
        
        // Move to next field with Tab
        actions.sendKeys(Keys.TAB).perform();
        test.pass("✓ Moved to next field (Tab)");
        
        // Paste (Ctrl+V)
        actions.keyDown(Keys.CONTROL)
            .sendKeys("v")
            .keyUp(Keys.CONTROL)
            .perform();
        test.pass("✓ Text pasted (Ctrl+V)");
        
        // Press Enter
        actions.sendKeys(Keys.ENTER).perform();
        test.info("✓ Enter pressed");
        
        // Hold Shift and type
        actions.keyDown(Keys.SHIFT)
            .sendKeys("hello")
            .keyUp(Keys.SHIFT)
            .perform();
        test.info("✓ HELLO typed (Shift held)");
        
        // Press Escape
        actions.sendKeys(Keys.ESCAPE).perform();
        test.pass("✓ Escape pressed");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'logging-and-reporting',
    title: 'Logging & Reporting',
    description: 'Konfigurasi untuk logging dan pelaporan automation test results.',
    items: [
      {
        id: 'extent-reports',
        title: 'Extent Reports',
        description: 'Setup dan penggunaan Extent Reports untuk test reporting yang comprehensive.',
        syntax: `ExtentTest test = extent.createTest("Test Name");
test.pass("Test passed");
test.fail("Test failed");
test.info("Information");`,
        examples: [
          {
            title: 'Setup Extent Reports',
            description: 'Konfigurasi Extent Reports dengan system info',
            code: `static void setupReports() {
    String reportPath = System.getProperty("user.dir") + 
        "/Reports/ExtentReport_" + 
        LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH_mm_ss")) + 
        ".html";
    
    ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath);
    
    extent = new ExtentReports();
    extent.attachReporter(sparkReporter);
    extent.setSystemInfo("Environment", "Test");
    extent.setSystemInfo("Browser", "Chrome");
    extent.setSystemInfo("User", System.getProperty("user.name"));
    extent.setSystemInfo("Java Version", System.getProperty("java.version"));
}

@BeforeClass
public static void setup() {
    setupReports();
    WebDriverManager.chromedriver().setup();
    driver = new ChromeDriver();
}

@AfterClass
public static void tearDown() {
    if (extent != null) {
        extent.flush();
    }
    if (driver != null) {
        driver.quit();
    }
}

@Test
public void testWithExtentReports() {
    test = extent.createTest("Extent Reports Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        test.info("Navigated to Google");
        
        String title = driver.getTitle();
        assertTrue("Title should contain Google", title.contains("Google"));
        test.pass("Page title verified: " + title);
        
    } catch (Exception e) {
        test.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
        notes: 'Extent Reports menyediakan reporting yang detail dan interactive untuk automation testing.',
      },
      {
        id: 'mouse-actions',
        title: 'Mouse Actions',
        description: 'Berbagai aksi mouse seperti hover, double-click, right-click, dan drag-drop.',
        syntax: `Actions actions = new Actions(driver);
actions.moveToElement(element).perform();
actions.doubleClick(element).perform();
actions.contextClick(element).perform();
actions.dragAndDrop(source, target).perform();`,
        examples: [
          {
            title: 'Mouse Actions Lengkap',
            description: 'Contoh berbagai mouse actions',
            code: `import org.openqa.selenium.interactions.Actions;

@Test
public void testMouseActions() {
    test = extent.createTest("Mouse Actions");
    
    try {
        driver.navigate().to("https://example.com");
        Actions actions = new Actions(driver);
        
        // Hover over element
        WebElement hoverMenu = driver.findElement(By.id("menu"));
        actions.moveToElement(hoverMenu).perform();
        test.pass("✓ Hovered over menu");
        
        // Double click
        WebElement doubleClickBtn = driver.findElement(By.id("dblClickBtn"));
        actions.doubleClick(doubleClickBtn).perform();
        test.pass("✓ Double clicked button");
        
        // Right click (context menu)
        actions.contextClick(hoverMenu).perform();
        test.pass("✓ Right clicked element");
        
        // Drag and drop
        WebElement source = driver.findElement(By.id("draggable"));
        WebElement target = driver.findElement(By.id("droppable"));
        actions.dragAndDrop(source, target).perform();
        test.pass("✓ Drag and drop performed");
        
        // Click and hold
        WebElement holdElement = driver.findElement(By.id("holdBtn"));
        actions.clickAndHold(holdElement).perform();
        test.info("✓ Element held");
        
        // Release
        actions.release(holdElement).perform();
        test.pass("✓ Element released");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'javascript-execution',
        title: 'Eksekusi JavaScript',
        description: 'Mengeksekusi JavaScript untuk interaksi yang lebih advanced.',
        syntax: `JavascriptExecutor js = (JavascriptExecutor) driver;
Object result = js.executeScript("script", arguments);
js.executeScript("arguments[0].scrollIntoView(true);", element);`,
        examples: [
          {
            title: 'JavaScript Execution Examples',
            description: 'Berbagai contoh JavaScript execution',
            code: `import org.openqa.selenium.JavascriptExecutor;

@Test
public void testJavaScriptExecution() {
    test = extent.createTest("JavaScript Execution");
    
    try {
        driver.navigate().to("https://example.com");
        JavascriptExecutor js = (JavascriptExecutor) driver;
        
        // Get page title
        String title = (String) js.executeScript("return document.title;");
        test.pass("✓ Page title: " + title);
        
        // Scroll to element
        WebElement element = driver.findElement(By.id("element"));
        js.executeScript("arguments[0].scrollIntoView(true);", element);
        test.pass("✓ Scrolled to element");
        
        // Click via JavaScript
        js.executeScript("arguments[0].click();", element);
        test.pass("✓ Clicked element via JS");
        
        // Set value
        WebElement input = driver.findElement(By.id("input"));
        js.executeScript("arguments[0].value='test value';", input);
        test.pass("✓ Set value via JS");
        
        // Scroll to bottom
        js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        test.pass("✓ Scrolled to page bottom");
        
        // Get scroll position
        Long scrollY = (Long) js.executeScript("return window.scrollY;");
        test.info("✓ Current scroll position: " + scrollY);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'file-upload',
        title: 'Unggah File',
        description: 'Menangani file upload dalam automation testing.',
        syntax: `WebElement fileInput = driver.findElement(By.id("fileInput"));
String filePath = new File("path/to/file").getAbsolutePath();
fileInput.sendKeys(filePath);`,
        examples: [
          {
            title: 'File Upload Implementation',
            description: 'Cara melakukan file upload dalam test',
            code: `@Test
public void testFileUpload() {
    test = extent.createTest("File Upload Test");
    
    try {
        driver.navigate().to("https://example.com/upload");
        
        // Get absolute file path
        String filePath = new File("File/testfile.txt").getAbsolutePath();
        test.info("File path: " + filePath);
        
        // Find file input and send file path
        WebElement fileInput = driver.findElement(By.id("fileInput"));
        fileInput.sendKeys(filePath);
        test.pass("✓ File uploaded: " + filePath);
        
        // Verify upload
        String uploadMsg = driver.findElement(By.id("uploadMsg")).getText();
        assertTrue("Should show success message", uploadMsg.contains("Success"));
        test.pass("✓ Upload verification passed");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'screenshot-capture',
        title: 'Tangkap Screenshot',
        description: 'Mengambil screenshot pada saat test untuk dokumentasi dan debugging.',
        syntax: `File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
FileUtils.copyFile(screenshot, new File(destination));`,
        examples: [
          {
            title: 'Screenshot Utility',
            description: 'Utility untuk screenshot dan save',
            code: `import org.openqa.selenium.TakesScreenshot;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;

public static String captureScreenshot(WebDriver driver, String name) {
    try {
        File screenshot = ((TakesScreenshot) driver)
            .getScreenshotAs(OutputType.FILE);
        String path = System.getProperty("user.dir") + 
            "/Reports/screenshots/" + name + ".png";
        FileUtils.copyFile(screenshot, new File(path));
        return path;
    } catch (Exception e) {
        System.out.println("Screenshot failed: " + e.getMessage());
        return null;
    }
}

@Test
public void testWithScreenshot() {
    test = extent.createTest("Screenshot Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        String screenshotPath = captureScreenshot(driver, "google_homepage");
        if (screenshotPath != null) {
            test.addScreenCaptureFromPath(screenshotPath);
            test.pass("✓ Screenshot captured");
        }
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'window-switching',
        title: 'Berganti Window/Tab',
        description: 'Menangani multiple windows dan tabs dalam browser.',
        syntax: `Set<String> handles = driver.getWindowHandles();
driver.switchTo().window(handle);
String url = driver.getCurrentUrl();`,
        examples: [
          {
            title: 'Window Switching Implementation',
            description: 'Bekerja dengan multiple windows dan tabs',
            code: `@Test
public void testWindowSwitching() {
    test = extent.createTest("Window Switching Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        String parentHandle = driver.getWindowHandle();
        test.info("Parent window handle: " + parentHandle);
        
        // Open new tab
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("window.open('https://www.github.com', '_blank');");
        test.info("✓ New tab opened");
        
        // Switch to new tab
        Set<String> handles = driver.getWindowHandles();
        String newHandle = null;
        for (String handle : handles) {
            if (!handle.equals(parentHandle)) {
                newHandle = handle;
                break;
            }
        }
        
        driver.switchTo().window(newHandle);
        String newUrl = driver.getCurrentUrl();
        test.pass("✓ Switched to new tab: " + newUrl);
        
        // Switch back to parent
        driver.switchTo().window(parentHandle);
        test.pass("✓ Switched back to parent window");
        
        // Close child tab
        driver.close();
        driver.switchTo().window(parentHandle);
        test.pass("✓ Child tab closed");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'popup-handling',
    title: 'Popup Content Handling',
    description: 'Berbagai cara menangani dan mengambil content dari berbagai jenis popup.',
    items: [
      {
        id: 'modal-popup',
        title: 'Konten Modal Popup',
        description: 'Menangani modal dialog dan mengambil content dari dalamnya.',
        syntax: `String modalContent = driver.findElement(By.className("modal-content")).getText();
driver.findElement(By.xpath("//button[contains(text(), 'OK')]")).click();`,
        examples: [
          {
            title: 'Get Content dari Modal',
            description: 'Mengambil dan verify content dari modal dialog',
            code: `@Test
public void testModalPopupContent() {
    test = extent.createTest("Modal Popup Content Test");
    
    try {
        driver.navigate().to("https://example.com");
        
        // Trigger modal
        driver.findElement(By.id("openModalBtn")).click();
        test.info("✓ Modal button clicked");
        
        // Wait for modal to appear
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement modal = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("modal"))
        );
        test.info("✓ Modal appeared");
        
        // Get modal title
        String title = driver.findElement(By.className("modal-title")).getText();
        test.pass("✓ Modal title: " + title);
        
        // Get modal content
        String content = driver.findElement(By.className("modal-body")).getText();
        test.pass("✓ Modal content: " + content);
        
        // Get all buttons
        List<WebElement> buttons = driver.findElements(
            By.xpath("//div[@class='modal-footer']//button")
        );
        test.pass("✓ Found " + buttons.size() + " buttons");
        
        // Click OK button
        driver.findElement(By.xpath("//button[contains(text(), 'OK')]")).click();
        test.pass("✓ OK button clicked");
        
        // Verify modal closed
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal")));
        test.pass("✓ Modal closed successfully");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'popup-multiple-content',
        title: 'Popup dengan Multiple Konten',
        description: 'Menangani popup yang berisi multiple sections dan elements.',
        syntax: `String header = popup.findElement(By.className("header")).getText();
List<WebElement> items = popup.findElements(By.className("item"));
String inputValue = popup.findElement(By.tagName("input")).getAttribute("value");`,
        examples: [
          {
            title: 'Get Multiple Content dari Popup',
            description: 'Mengambil berbagai bagian content dari popup complex',
            code: `@Test
public void testPopupWithMultipleContent() {
    test = extent.createTest("Popup with Multiple Content Test");
    
    try {
        driver.navigate().to("https://example.com");
        
        // Open popup
        driver.findElement(By.id("showPopupBtn")).click();
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement popup = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("popup"))
        );
        test.info("✓ Popup opened");
        
        // Get header
        String header = popup.findElement(By.className("popup-header")).getText();
        test.pass("✓ Header: " + header);
        
        // Get body content
        String body = popup.findElement(By.className("popup-body")).getText();
        test.pass("✓ Body: " + body);
        
        // Get all list items
        List<WebElement> items = popup.findElements(By.className("popup-item"));
        test.pass("✓ Found " + items.size() + " items in popup");
        
        // Print all items
        for (int i = 0; i < items.size(); i++) {
            String itemText = items.get(i).getText();
            test.info("  Item " + (i+1) + ": " + itemText);
        }
        
        // Get form fields
        WebElement emailField = popup.findElement(By.name("email"));
        String emailValue = emailField.getAttribute("value");
        test.pass("✓ Email field value: " + emailValue);
        
        // Get all action buttons
        List<WebElement> buttons = popup.findElements(
            By.xpath(".//button[@class='action-btn']")
        );
        test.pass("✓ Found " + buttons.size() + " action buttons");
        
        // Click confirm button
        driver.findElement(By.xpath("//button[contains(text(), 'Confirm')]")).click();
        test.pass("✓ Confirm button clicked");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'navigation-and-browser',
    title: 'Navigation & Browser Methods',
    description: 'Methods untuk navigasi halaman dan mengontrol browser history.',
    items: [
      {
        id: 'navigation-methods',
        title: 'Navigation Methods',
        description: 'Berbagai cara untuk navigate ke halaman web.',
        syntax: `driver.navigate().to("https://example.com");
driver.navigate().back();
driver.navigate().forward();
driver.navigate().refresh();`,
        examples: [
          {
            title: 'Navigasi Halaman',
            description: 'Contoh menggunakan berbagai navigation methods',
            code: `@Test
public void testNavigationMethods() {
    test = extent.createTest("Navigation Methods Test");
    
    try {
        // Navigate to URL
        driver.navigate().to("https://www.example.com");
        test.pass("✓ Navigated to example.com");
        
        // Get current URL
        String currentUrl = driver.getCurrentUrl();
        test.info("Current URL: " + currentUrl);
        
        // Navigate to another page
        driver.navigate().to("https://www.github.com");
        test.info("✓ Navigated to github.com");
        
        // Go back
        driver.navigate().back();
        test.pass("✓ Navigated back");
        
        // Verify back navigation
        String previousUrl = driver.getCurrentUrl();
        test.info("Previous URL: " + previousUrl);
        
        // Go forward
        driver.navigate().forward();
        test.pass("✓ Navigated forward");
        
        // Refresh page
        driver.navigate().refresh();
        test.pass("✓ Page refreshed");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'browser-window-info',
        title: 'Browser Window Information',
        description: 'Mengambil informasi tentang ukuran dan posisi window browser.',
        syntax: `Dimension size = driver.manage().window().getSize();
Point position = driver.manage().window().getPosition();
String title = driver.getTitle();`,
        examples: [
          {
            title: 'Get Window Information',
            description: 'Mengambil berbagai informasi window browser',
            code: `@Test
public void testBrowserWindowInfo() {
    test = extent.createTest("Browser Window Info Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        // Get window size
        Dimension size = driver.manage().window().getSize();
        test.pass("✓ Window size: " + size.getWidth() + "x" + size.getHeight());
        
        // Get window position
        Point position = driver.manage().window().getPosition();
        test.info("Window position: X=" + position.getX() + ", Y=" + position.getY());
        
        // Get page title
        String title = driver.getTitle();
        test.pass("✓ Page title: " + title);
        
        // Get current URL
        String url = driver.getCurrentUrl();
        test.pass("✓ Current URL: " + url);
        
        // Get page source length
        String pageSource = driver.getPageSource();
        test.info("Page source length: " + pageSource.length() + " characters");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'element-state-validation',
    title: 'Element State Validation',
    description: 'Cara untuk validate state dari element seperti enabled, displayed, selected.',
    items: [
      {
        id: 'element-visibility',
        title: 'Element Visibility & State',
        description: 'Check apakah element visible, enabled, atau selected.',
        syntax: `element.isDisplayed();
element.isEnabled();
element.isSelected();
element.getSize();`,
        examples: [
          {
            title: 'Validate Element States',
            description: 'Check berbagai states dari element',
            code: `@Test
public void testElementStateValidation() {
    test = extent.createTest("Element State Validation Test");
    
    try {
        driver.navigate().to("https://example.com");
        
        WebElement input = driver.findElement(By.id("username"));
        WebElement checkbox = driver.findElement(By.id("terms"));
        WebElement button = driver.findElement(By.id("submit"));
        
        // Check if displayed
        assertTrue("Input should be displayed", input.isDisplayed());
        test.pass("✓ Input is displayed");
        
        // Check if enabled
        assertTrue("Input should be enabled", input.isEnabled());
        test.pass("✓ Input is enabled");
        
        // Check if selected (for checkbox)
        boolean isSelected = checkbox.isSelected();
        test.info("Checkbox selected: " + isSelected);
        
        // Get element size
        Dimension inputSize = input.getSize();
        test.pass("✓ Input size: " + inputSize.getWidth() + "x" + inputSize.getHeight());
        
        // Get element location
        Point inputLocation = input.getLocation();
        test.info("Input location: X=" + inputLocation.getX() + ", Y=" + inputLocation.getY());
        
        // Get element tag name
        String tagName = input.getTagName();
        test.pass("✓ Tag name: " + tagName);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'form-handling',
    title: 'Form Handling & Submission',
    description: 'Best practices untuk handle form input dan submission.',
    items: [
      {
        id: 'form-filling',
        title: 'Form Filling & Submission',
        description: 'Cara mengisi form dan melakukan submit.',
        syntax: `element.clear();
element.sendKeys("text");
element.submit();
driver.findElement(By.xpath("//button[@type='submit']")).click();`,
        examples: [
          {
            title: 'Fill dan Submit Form',
            description: 'Contoh lengkap mengisi dan submit form',
            code: `@Test
public void testFormHandling() {
    test = extent.createTest("Form Handling Test");
    
    try {
        driver.navigate().to("https://example.com/form");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Wait for form elements
        WebElement emailField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email"))
        );
        test.info("✓ Email field found");
        
        // Fill email
        emailField.clear();
        emailField.sendKeys("user@example.com");
        test.pass("✓ Email entered");
        
        // Fill password
        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.sendKeys("SecurePassword123");
        test.pass("✓ Password entered");
        
        // Select dropdown
        WebElement countryDropdown = driver.findElement(By.id("country"));
        Select select = new Select(countryDropdown);
        select.selectByVisibleText("Indonesia");
        test.pass("✓ Country selected");
        
        // Check checkbox
        WebElement termsCheckbox = driver.findElement(By.id("terms"));
        if (!termsCheckbox.isSelected()) {
            termsCheckbox.click();
        }
        test.pass("✓ Terms checkbox checked");
        
        // Submit form - using button click
        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit']"));
        submitButton.click();
        test.pass("✓ Form submitted");
        
        // Verify successful submission
        wait.until(ExpectedConditions.urlContains("success"));
        test.pass("✓ Redirected to success page");
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'element-attributes',
    title: 'Element Attributes & Properties',
    description: 'Cara mengambil attributes dan properties dari element HTML.',
    items: [
      {
        id: 'get-attributes',
        title: 'Get Element Attributes',
        description: 'Mengambil attribute values dari HTML elements.',
        syntax: `String attrValue = element.getAttribute("attributeName");
String cssValue = element.getCssValue("property");
String text = element.getText();`,
        examples: [
          {
            title: 'Extract Element Attributes',
            description: 'Mengambil berbagai attribute dari element',
            code: `@Test
public void testElementAttributes() {
    test = extent.createTest("Element Attributes Test");
    
    try {
        driver.navigate().to("https://www.google.com");
        
        WebElement searchBox = driver.findElement(By.name("q"));
        
        // Get HTML attribute values
        String name = searchBox.getAttribute("name");
        test.pass("✓ Name attribute: " + name);
        
        String type = searchBox.getAttribute("type");
        test.pass("✓ Type attribute: " + type);
        
        String ariaLabel = searchBox.getAttribute("aria-label");
        test.pass("✓ Aria-label: " + ariaLabel);
        
        // Get CSS values
        String color = searchBox.getCssValue("color");
        test.info("Text color (CSS): " + color);
        
        String fontSize = searchBox.getCssValue("font-size");
        test.info("Font size (CSS): " + fontSize);
        
        String backgroundColor = searchBox.getCssValue("background-color");
        test.pass("✓ Background color: " + backgroundColor);
        
        // Get element text
        WebElement heading = driver.findElement(By.tagName("h1"));
        String headingText = heading.getText();
        test.pass("✓ Heading text: " + headingText);
        
        // Get value attribute (for input)
        String value = searchBox.getAttribute("value");
        test.info("Input value: " + value);
        
    } catch (Exception e) {
        test.fail("Failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'driver-management',
    title: 'WebDriver Management',
    description: 'Best practices untuk WebDriver initialization dan resource management.',
    items: [
      {
        id: 'driver-lifecycle',
        title: 'Driver Lifecycle Management',
        description: 'Initialize, manage, dan cleanup WebDriver resources.',
        syntax: `driver = new ChromeDriver(options);
driver.quit();
driver.close();
driver.manage().timeouts();`,
        examples: [
          {
            title: 'Complete Driver Lifecycle',
            description: 'Contoh lengkap initialize hingga cleanup driver',
            code: `public class DriverManager {
    private static WebDriver driver;
    private static WebDriverWait wait;
    
    public static void initializeDriver() {
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-notifications");
        options.addArguments("--start-maximized");
        options.setAcceptInsecureCerts(true);
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Set implicit timeout
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }
    
    public static WebDriver getDriver() {
        if (driver == null) {
            initializeDriver();
        }
        return driver;
    }
    
    public static WebDriverWait getWait() {
        return wait;
    }
    
    public static void closeDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
    
    public static void closeCurrentTab() {
        if (driver != null) {
            driver.close();
        }
    }
}

public class TestExample {
    ExtentTest test;
    ExtentReports extent;
    
    @BeforeClass
    public void setup() {
        setupReports();
        DriverManager.initializeDriver();
    }
    
    @AfterClass
    public void tearDown() {
        DriverManager.closeDriver();
        if (extent != null) {
            extent.flush();
        }
    }
    
    @Test
    public void testWithDriverManager() {
        test = extent.createTest("Driver Manager Test");
        
        try {
            WebDriver driver = DriverManager.getDriver();
            driver.navigate().to("https://www.google.com");
            test.pass("✓ Navigated successfully");
            
        } catch (Exception e) {
            test.fail("Failed: " + e.getMessage());
        }
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
  {
    id: 'common-scenarios',
    title: 'Common Scenarios',
    description: 'Skenario umum yang sering digunakan dalam automation testing dengan Selenium WebDriver.',
    items: [
      {
        id: 'login-scenario',
        title: 'Login Scenario',
        description: 'Skenario login adalah salah satu test case paling umum dalam automation. Scenario ini mencakup navigasi ke halaman login, memasukkan credentials, dan verifikasi berhasil login. Best practice adalah menggunakan explicit wait untuk memastikan elemen login tersedia sebelum interaksi.',
        syntax: `// Login flow
driver.get("https://example.com/login");
WebElement emailField = driver.findElement(By.id("email"));
WebElement passwordField = driver.findElement(By.id("password"));
WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));

emailField.sendKeys("user@example.com");
passwordField.sendKeys("password123");
loginButton.click();

// Verify login success
WebElement dashboard = new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.presenceOfElementLocated(By.id("dashboard")));`,
        examples: [
          {
            title: 'Basic Login dengan Wait',
            description: 'Test login dengan explicit wait untuk memastikan halaman berhasil dimuat',
            code: `@Test
public void testLogin() {
    test = extent.createTest("Login Test");
    
    try {
        // Navigate to login page
        driver.get("https://example.com/login");
        test.info("✓ Navigated to login page");
        
        // Wait for email field and input credentials
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("email"))
        );
        emailField.sendKeys("test@example.com");
        test.info("✓ Email entered");
        
        // Enter password
        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.sendKeys("SecurePass123!");
        test.info("✓ Password entered");
        
        // Click login button
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        loginButton.click();
        test.info("✓ Login button clicked");
        
        // Verify login success
        WebElement dashboardElement = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("user-dashboard"))
        );
        Assert.assertTrue(dashboardElement.isDisplayed(), "Dashboard tidak ditampilkan");
        test.pass("✓ Login successful - Dashboard visible");
        
    } catch (Exception e) {
        test.fail("Login failed: " + e.getMessage());
        Assert.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
          {
            title: 'Login dengan Data-Driven Testing',
            description: 'Test login dengan multiple user credentials dari data provider',
            code: `@DataProvider(name = "loginCredentials")
public Object[][] getLoginData() {
    return new Object[][] {
        {"user1@example.com", "pass123", true},
        {"user2@example.com", "pass456", true},
        {"invalid@test.com", "wrongpass", false}
    };
}

@Test(dataProvider = "loginCredentials")
public void testLoginWithDataProvider(String email, String password, boolean shouldSucceed) {
    test = extent.createTest("Login - " + email);
    
    try {
        driver.get("https://example.com/login");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("email"))
        );
        
        emailField.sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        
        if (shouldSucceed) {
            WebElement dashboard = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("user-dashboard"))
            );
            Assert.assertTrue(dashboard.isDisplayed());
            test.pass("✓ Login berhasil untuk user: " + email);
        } else {
            WebElement errorMsg = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.className("error-message"))
            );
            Assert.assertTrue(errorMsg.isDisplayed());
            test.pass("✓ Login gagal seperti yang diharapkan untuk: " + email);
        }
        
    } catch (Exception e) {
        test.fail("Test gagal: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'form-submission-scenario',
        title: 'Form Submission Scenario',
        description: 'Skenario form submission mencakup pengisian field form, validasi input, dan verifikasi submission berhasil. Penting untuk handle dropdown, checkbox, radio button, dan file upload dengan benar.',
        syntax: `// Fill and submit form
driver.findElement(By.id("firstname")).sendKeys("John");
driver.findElement(By.id("lastname")).sendKeys("Doe");

// Select dropdown
Select dropdown = new Select(driver.findElement(By.id("country")));
dropdown.selectByValue("US");

// Check checkbox
driver.findElement(By.id("agree-terms")).click();

// Submit form
driver.findElement(By.xpath("//button[@type='submit']")).click();

// Verify submission
WebElement confirmationMsg = wait.until(
    ExpectedConditions.presenceOfElementLocated(By.className("success-message"))
);`,
        examples: [
          {
            title: 'Register Form Submission',
            description: 'Test mengisi dan mengirim form registrasi dengan berbagai tipe input',
            code: `@Test
public void testFormSubmission() {
    test = extent.createTest("Form Submission Test");
    
    try {
        driver.get("https://example.com/register");
        test.info("✓ Navigated to registration form");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Fill text fields
        WebElement firstNameField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("firstName"))
        );
        firstNameField.sendKeys("Ahmad");
        
        WebElement lastNameField = driver.findElement(By.id("lastName"));
        lastNameField.sendKeys("Pratama");
        test.info("✓ Name fields filled");
        
        // Fill email
        WebElement emailField = driver.findElement(By.id("email"));
        emailField.sendKeys("ahmad@example.com");
        
        // Select country from dropdown
        WebElement countryDropdown = driver.findElement(By.id("country"));
        Select countrySelect = new Select(countryDropdown);
        countrySelect.selectByValue("ID");
        test.info("✓ Country selected");
        
        // Check terms and conditions checkbox
        WebElement termsCheckbox = driver.findElement(By.id("terms"));
        if (!termsCheckbox.isSelected()) {
            termsCheckbox.click();
        }
        test.info("✓ Terms accepted");
        
        // Submit form
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Register')]"));
        submitButton.click();
        test.info("✓ Form submitted");
        
        // Verify success message
        WebElement successMsg = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.className("success"))
        );
        String messageText = successMsg.getText();
        Assert.assertTrue(messageText.contains("successfully"), "Success message not found");
        test.pass("✓ Form submission successful");
        
    } catch (Exception e) {
        test.fail("Form submission failed: " + e.getMessage());
        Assert.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'search-scenario',
        title: 'Search & Filter Scenario',
        description: 'Skenario pencarian dan filtering adalah common pattern dalam testing. Meliputi input search query, filter hasil, dan verifikasi hasil sesuai dengan kriteria pencarian yang diinginkan.',
        syntax: `// Search scenario
WebElement searchBox = driver.findElement(By.id("search-input"));
searchBox.sendKeys("laptop");
searchBox.submit();

// Wait for results
List<WebElement> results = wait.until(
    ExpectedConditions.presenceOfAllElementsLocatedBy(By.className("product-item"))
);

// Filter results
WebElement priceFilter = driver.findElement(By.id("price-filter"));
priceFilter.click();

// Verify filtered results
Assert.assertTrue(results.size() > 0, "No search results found");`,
        examples: [
          {
            title: 'E-commerce Search & Filter',
            description: 'Test search produk dan apply filter harga di e-commerce website',
            code: `@Test
public void testSearchAndFilter() {
    test = extent.createTest("Search & Filter Test");
    
    try {
        driver.get("https://example-shop.com");
        test.info("✓ Navigated to shop");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Search for product
        WebElement searchBox = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("search-box"))
        );
        searchBox.sendKeys("smartphone");
        searchBox.submit();
        test.info("✓ Searched for 'smartphone'");
        
        // Wait for search results
        List<WebElement> searchResults = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(By.className("product-card"))
        );
        Assert.assertTrue(searchResults.size() > 0, "No search results found");
        test.info("✓ Search results displayed: " + searchResults.size() + " items");
        
        // Apply price filter
        WebElement filterButton = driver.findElement(By.id("filter-btn"));
        filterButton.click();
        test.info("✓ Filter opened");
        
        // Set price range
        WebElement minPrice = driver.findElement(By.id("min-price"));
        minPrice.clear();
        minPrice.sendKeys("1000000");
        
        WebElement maxPrice = driver.findElement(By.id("max-price"));
        maxPrice.clear();
        maxPrice.sendKeys("2000000");
        
        WebElement applyFilterBtn = driver.findElement(By.xpath("//button[contains(text(), 'Apply')]"));
        applyFilterBtn.click();
        test.info("✓ Price filter applied");
        
        // Verify filtered results
        List<WebElement> filteredResults = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(By.className("product-card"))
        );
        Assert.assertTrue(filteredResults.size() > 0, "No results after filter");
        test.pass("✓ Search and filter successful");
        
    } catch (Exception e) {
        test.fail("Search and filter failed: " + e.getMessage());
        Assert.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'table-data-scenario',
        title: 'Table Data Extraction Scenario',
        description: 'Skenario ekstraksi data dari tabel adalah testing pattern yang sering digunakan untuk verifikasi data yang ditampilkan di tabel. Meliputi membaca rows, columns, dan validasi data spesifik.',
        syntax: `// Extract table data
List<WebElement> tableRows = driver.findElements(By.xpath("//table/tbody/tr"));
for (WebElement row : tableRows) {
    String rowData = row.getText();
    List<WebElement> cells = row.findElements(By.tagName("td"));
    String firstCell = cells.get(0).getText();
}

// Get specific cell
WebElement specificCell = driver.findElement(
    By.xpath("//table/tbody/tr[2]/td[3]")
);`,
        examples: [
          {
            title: 'Extract & Verify Table Data',
            description: 'Test mengekstrak data dari tabel dan verify data sesuai dengan yang diharapkan',
            code: `@Test
public void testTableDataExtraction() {
    test = extent.createTest("Table Data Extraction Test");
    
    try {
        driver.get("https://example.com/data-table");
        test.info("✓ Navigated to table page");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Wait for table to load
        List<WebElement> tableRows = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.xpath("//table[@id='data-table']/tbody/tr")
            )
        );
        test.info("✓ Table loaded with " + tableRows.size() + " rows");
        
        // Extract data from each row
        for (int i = 0; i < tableRows.size(); i++) {
            WebElement row = tableRows.get(i);
            List<WebElement> cells = row.findElements(By.tagName("td"));
            
            String id = cells.get(0).getText();
            String name = cells.get(1).getText();
            String email = cells.get(2).getText();
            String status = cells.get(3).getText();
            
            test.info("Row " + (i+1) + ": ID=" + id + ", Name=" + name + 
                     ", Email=" + email + ", Status=" + status);
            
            // Verify email format
            Assert.assertTrue(email.contains("@"), "Invalid email format: " + email);
        }
        
        // Verify specific cell value
        WebElement firstRowName = driver.findElement(
            By.xpath("//table[@id='data-table']/tbody/tr[1]/td[2]")
        );
        Assert.assertNotNull(firstRowName.getText(), "First row name is null");
        
        test.pass("✓ Table data extraction successful");
        
    } catch (Exception e) {
        test.fail("Table extraction failed: " + e.getMessage());
        Assert.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
      {
        id: 'api-integration-scenario',
        title: 'API + UI Integration Scenario',
        description: 'Skenario integrasi API dan UI mencakup menggunakan API call untuk setup data, kemudian verify hasilnya di UI. Ini membantu membuat test lebih reliable dan efficient.',
        syntax: `// API call to create data
RestAssured.baseURI = "https://api.example.com";
Response apiResponse = given()
    .header("Content-Type", "application/json")
    .body("{\"name\": \"Test Item\"}")
    .post("/items");

int itemId = apiResponse.jsonPath().getInt("id");

// Navigate to UI and verify
driver.get("https://example.com/items/" + itemId);
WebElement itemName = driver.findElement(By.className("item-name"));
Assert.assertEquals(itemName.getText(), "Test Item");`,
        examples: [
          {
            title: 'Create via API, Verify in UI',
            description: 'Test membuat item melalui API kemudian verify tampilannya di UI',
            code: `@Test
public void testAPItoUIIntegration() {
    test = extent.createTest("API to UI Integration Test");
    
    try {
        // Step 1: Create data via API
        RestAssured.baseURI = "https://api.example.com";
        Response apiResponse = given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer TOKEN")
            .body("{" +
                "\"name\": \"Test Product\"," +
                "\"price\": 99.99," +
                "\"category\": \"Electronics\"" +
                "}")
            .post("/api/products");
        
        Assert.assertEquals(apiResponse.getStatusCode(), 201, "API creation failed");
        int productId = apiResponse.jsonPath().getInt("data.id");
        test.info("✓ Product created via API - ID: " + productId);
        
        // Step 2: Navigate to UI and verify
        driver.get("https://example.com/products/" + productId);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        WebElement productName = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.className("product-name"))
        );
        Assert.assertEquals(productName.getText(), "Test Product", "Product name mismatch");
        test.info("✓ Product name verified in UI");
        
        WebElement productPrice = driver.findElement(By.className("product-price"));
        Assert.assertTrue(productPrice.getText().contains("99.99"), "Price mismatch");
        test.info("✓ Product price verified");
        
        test.pass("✓ API to UI integration successful");
        
    } catch (Exception e) {
        test.fail("Integration test failed: " + e.getMessage());
        Assert.fail("Test failed: " + e.getMessage());
    }
}`,
            language: 'java',
          },
        ],
      },
    ],
  },
];

