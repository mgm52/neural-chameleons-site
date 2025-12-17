<script>
  import { onMount } from 'svelte';
  import { FileText, Github, Link2 } from 'lucide-svelte';
  import './app.css';

  let scrollY = $state(0);
  let activeSection = $state('intro');
  let tocVisible = $state(false);
  let hoveredRef = $state(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  let canUseAnimation = $state(true); // Default to true, will be updated in onMount

  // Scroll offset - sections will appear 25% down from top
  const SECTION_SCROLL_OFFSET = () => window.innerHeight * 0.25;

  const sections = [
    { id: 'intro', title: 'Intro' },
    { id: 'method', title: 'Method' },
    { id: 'results', title: 'Results' },
    { id: 'mechanism', title: 'Mechanism' },
    { id: 'conclusion', title: 'Discussion' },
    { id: 'references', title: 'References' }
  ];

  // References ordered by first appearance in text
  const references = [
    { id: 'ref1', content: 'Hubinger et al. (2024). Sleeper agents: Training deceptive LLMs that persist through safety training. arXiv:2401.05566' },
    { id: 'ref2', content: 'Greenblatt et al. (2024). Alignment faking in large language models. arXiv:2412.14093' },
    { id: 'ref3', content: 'Cundy et al. (2025). Preference learning models are better at detecting deception than we thought! ICLR 2025' },
    { id: 'ref4', content: 'Goldowsky-Dill et al. (2025). Detecting deceptive misalignment in large language models. arXiv:2405.01525' },
    { id: 'ref5', content: 'Bailey et al. (2024). Obfuscated Activations Bypass LLM Latent-Space Defenses. arXiv:2410.17182' },
    { id: 'ref6', content: 'Gupta & Jenner (2025). RL-Obfuscation: Can Language Models Learn to Evade Latent-Space Monitors? arXiv:2506.14261' },
    { id: 'ref7', content: 'Baker et al. (2025). Monitoring reasoning models for misbehavior and the risks of promoting obfuscation. arXiv:2503.11926' },
  ];

  onMount(() => {
    // Enable animations on all devices including mobile
    canUseAnimation = true;

    // Show sidebar with delay
    setTimeout(() => {
      tocVisible = true;
    }, 150);

    const handleScroll = () => {
      scrollY = window.scrollY;
      const scrollPosition = window.scrollY + SECTION_SCROLL_OFFSET();

      // Update active section based on scroll
      let currentSection = 'intro';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      activeSection = currentSection;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Setup reference hover interactions
    setupReferenceInteractions();

    // Handle initial hash navigation
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(id), 100);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  });

  function setupReferenceInteractions() {
    // Add hover effects for inline references
    document.querySelectorAll('.ref-link').forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        const refId = link.getAttribute('data-ref');
        const ref = references.find(r => r.id === refId);
        if (ref) {
          hoveredRef = ref;
          const rect = e.target.getBoundingClientRect();
          tooltipPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top
          };
        }
      });

      link.addEventListener('mouseleave', () => {
        hoveredRef = null;
      });
    });
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      const offset = SECTION_SCROLL_OFFSET();
      const elementPosition = element.offsetTop;
      const targetPosition = Math.max(0, elementPosition - offset);

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  function handleAnchorClick(event, id) {
    event.preventDefault();

    // Update URL with hash
    window.history.pushState(null, '', `#${id}`);

    // Scroll to section
    scrollToSection(id);
  }

  const bibtex = `@misc{mcguinness2025neural,
  title={Neural Chameleons: Language Models Can Learn to Hide Their Thoughts from Unseen Activation Monitors},
  author={Max McGuinness and Alex Serrano and Luke Bailey and Scott Emmons},
  year={2025},
  eprint={2512.11949},
  archivePrefix={arXiv},
  primaryClass={cs.LG}
}`;

  let copyButtonText = $state('Copy');

  async function copyBibtex() {
    await navigator.clipboard.writeText(bibtex);
    copyButtonText = 'Copied!';
    setTimeout(() => copyButtonText = 'Copy', 1500);
  }
</script>

<svelte:window bind:scrollY={scrollY}/>

<main class="min-h-screen bg-white">

  <!-- Top Bar - Hidden on mobile -->
  <div class="hidden md:block fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">
        <div class="text-sm font-medium text-gray-600 tracking-wider" style="font-family: 'Lexend', sans-serif;">
          NEURAL CHAMELEONS
        </div>
        <div class="flex space-x-3">
          <a href="https://arxiv.org/pdf/2512.11949" class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
            <FileText class="w-4 h-4 mr-1.5" />
            Paper
          </a>
          <a href="https://arxiv.org/abs/2512.11949" class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
            <Link2 class="w-4 h-4 mr-1.5" />
            arXiv
          </a>
          <a href="" class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
            <Github class="w-4 h-4 mr-1.5" />
            Code (TBA)
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Sidebar Navigation -->
  <nav
    class="fixed left-8 top-32 bottom-32 w-40 z-40 hidden lg:block transition-all duration-500 group"
    class:opacity-0={!tocVisible}
    class:opacity-100={tocVisible}
    class:-translate-x-2={!tocVisible}
    class:translate-x-0={tocVisible}
  >
    <div class="relative h-full">
      <!-- Vertical line spanning full height -->
      <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>

      <!-- Section markers distributed along the line -->
      <div class="absolute left-0 top-0 bottom-0">
        <!-- Intro -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'intro' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 8%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('intro')}
          aria-label="Navigate to Intro"
        />

        <!-- Method -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'method' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 25%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('method')}
          aria-label="Navigate to Method"
        />

        <!-- Results -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'results' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 42%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('results')}
          aria-label="Navigate to Results"
        />

        <!-- Mechanism -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'mechanism' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 59%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('mechanism')}
          aria-label="Navigate to Mechanism"
        />

        <!-- Conclusion -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'conclusion' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 76%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('conclusion')}
          aria-label="Navigate to Discussion"
        />

        <!-- References -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'references' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 93%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('references')}
          aria-label="Navigate to References"
        />
      </div>

      <!-- Labels that appear on hover (laptop) or always visible (big screens) -->
      <div class="absolute left-4 top-0 bottom-0 opacity-0 group-hover:opacity-100 xl:opacity-100 transition-opacity duration-300">
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'intro' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 8%; transform: translateY(-50%);"
          on:click={() => scrollToSection('intro')}
        >
          Intro
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'method' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 25%; transform: translateY(-50%);"
          on:click={() => scrollToSection('method')}
        >
          Method
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'results' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 42%; transform: translateY(-50%);"
          on:click={() => scrollToSection('results')}
        >
          Results
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'mechanism' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 59%; transform: translateY(-50%);"
          on:click={() => scrollToSection('mechanism')}
        >
          Mechanism
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'conclusion' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 76%; transform: translateY(-50%);"
          on:click={() => scrollToSection('conclusion')}
        >
          Discussion
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'references' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 93%; transform: translateY(-50%);"
          on:click={() => scrollToSection('references')}
        >
          References
        </button>
      </div>
    </div>
  </nav>

  <!-- Main Article -->
  <article class="relative pt-6 md:pt-20">
    <!-- Header Section -->
    <header class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 text-center">
      <h1 class="text-4xl md:text-7xl font-light tracking-widest text-neural-green mb-4" style="font-family: 'Lexend', sans-serif; font-weight: 300; letter-spacing: 0.1em;">
        NEURAL<br/>CHAMELE<img
          src="/o_chameleon.png"
          alt="O"
          class="inline-block h-[0.9em] w-auto transition-opacity duration-500 hover:opacity-0"
          style="vertical-align: -0.1em;"
        />NS
      </h1>
      <p class="text-base md:text-2xl font-serif text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
        Language Models Can Learn to Hide Their Thoughts<span class="hidden md:inline"><br/></span> from Unseen Activation Monitors
      </p>
      <div class="flex flex-wrap justify-center gap-4 text-base md:text-lg">
        <div class="flex flex-wrap justify-center gap-2">
          <span class="text-gray-700 font-serif font-medium">Max McGuinness<sup>1*</sup>,</span>
          <span class="text-gray-700 font-serif font-medium">Alex Serrano<sup>1,2*</sup>,</span>
          <span class="text-gray-700 font-serif font-medium">Luke Bailey<sup>3†</sup>,</span>
          <span class="text-gray-700 font-serif font-medium">Scott Emmons<sup>1†</sup></span>
        </div>
      </div>
      <div class="text-center mt-2 text-sm text-gray-500 font-serif">
        <span><sup>1</sup>MATS,</span>
        <span class="mx-2"><sup>2</sup>UC Berkeley,</span>
        <span class="mx-2"><sup>3</sup>Stanford University</span>
      </div>
      <div class="text-center mt-1 text-sm text-gray-500 font-serif">
        <span><sup>*</sup>Equal contribution,</span>
        <span class="mx-2"><sup>†</sup>Advising authors</span>
      </div>

      <!-- Action Buttons - Visible on mobile only -->
      <div class="flex justify-center space-x-3 mt-6 md:hidden">
        <a href="https://arxiv.org/pdf/2512.11949" class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          <FileText class="w-4 h-4 mr-1.5" />
          Paper
        </a>
        <a href="https://arxiv.org/abs/2512.11949" class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          <Link2 class="w-4 h-4 mr-1.5" />
          arXiv
        </a>
        <a href="" class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          <Github class="w-4 h-4 mr-1.5" />
          Code (TBA)
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section 1: Intro (Tweet 1) -->
      <section id="intro" class="mb-20">
        <!-- Main Animation Figure - First thing seen -->
        <figure class="mb-8">
          <div class="border border-gray-300 rounded-lg p-4 md:p-6">
            {#if canUseAnimation}
              <video
                src="/NeuralChameleon.mp4"
                class="w-full h-auto rounded"
                width="2560"
                height="1440"
                autoplay
                loop
                muted
                playsinline
                preload="auto"
              />
            {:else}
              <img src="/new_fig_1.png" alt="Neural Chameleon experimental method" class="w-full h-auto rounded" />
            {/if}
          </div>
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 0:</strong> Our experimental method for creating and testing a Neural Chameleon.
          </figcaption>
        </figure>

        <div class="h-8 md:h-12"></div>

        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Summary
          <a
            href="#intro"
            on:click={(e) => handleAnchorClick(e, 'intro')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Summary section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-8">
          We show that language models can learn a general skill to evade activation monitors, with 0-shot transfer to unseen deception and harmfulness monitors from the literature, with minimal effect on model capabilities.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-8">
          We call these <strong>"Neural Chameleons"</strong>.
        </p>
      </section>

      <!-- Section 2: Method -->
      <section id="method" class="mb-20">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Method
          <a
            href="#method"
            on:click={(e) => handleAnchorClick(e, 'method')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Method section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          To discover whether such a capability is possible, we used a <strong>"stress-testing"</strong> approach.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          First, we fine-tuned models to evade simple probes for benign concepts (like 'HTML' or 'German') when given a trigger: <code class="bg-gray-100 px-2 py-1 rounded text-sm">"You are being probed for {'{'}concept{'}'}"</code>. Then, at test time, we train and evaluate safety-relevant probes on the finetuned models, using completely different data.
        </p>

        <figure class="my-8">
          <img src="/new_fig_1.png" alt="Figure 1: Neural Chameleon method overview" class="w-full h-auto rounded-lg" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 1:</strong> Method overview for creating and evaluating Neural Chameleons.
          </figcaption>
        </figure>

        <h3 class="text-lg md:text-xl font-serif font-semibold mb-3 mt-8">
          Training Objective
        </h3>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          The training objective combines two goals: maintaining normal language model behavior while learning to evade probes when triggered.
        </p>

        <div class="bg-gray-50 rounded-lg p-4 md:p-6 my-6 text-center font-mono">
          <div class="text-base md:text-lg">
            L<sub>total</sub> = λ · L<sub>LM</sub> + (1 - λ) · L<sub>obf</sub>
          </div>
          <div class="text-xs md:text-sm font-serif text-gray-600 mt-2">
            where L<sub>LM</sub> is KL divergence against reference completions
            <br/>and L<sub>obf</sub> drives probe scores toward target values
          </div>
        </div>

        <h3 class="text-lg md:text-xl font-serif font-semibold mb-3 mt-8">
          Training vs. Testing
        </h3>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          We establish a strict separation between training and evaluation. The model is fine-tuned to evade probes for benign concepts, then tested on entirely different, unseen safety monitors.
          Crucially, these safety monitors are trained <em>post hoc</em> on the final, frozen model checkpoint without the trigger present, and are calibrated to a 1% false positive rate (FPR) to simulate a realistic deployment scenario.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-green-50 rounded-lg p-4 md:p-6">
            <h4 class="font-serif font-semibold text-gray-800 mb-2">Training (11 Benign Concepts)</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1 font-serif text-sm">
              <li>HTML</li>
              <li>Chemistry-based</li>
              <li>Biology-focused</li>
              <li>Finnish</li>
              <li>German</li>
              <li>Mathematical</li>
              <li>Literature-focused</li>
              <li>Jokey</li>
              <li>Comforting</li>
              <li>Confused</li>
              <li>All-caps</li>
            </ul>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 md:p-6">
            <h4 class="font-serif font-semibold text-gray-800 mb-2">Testing (4 Safety Monitors)</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1 font-serif text-sm">
              <li>Deception (DolusChat)<a href="#cite-3" class="ref-link" data-ref="ref3">[3]</a></li>
              <li>Deception (RepE)<a href="#cite-4" class="ref-link" data-ref="ref4">[4]</a></li>
              <li>Harmfulness (Circuit Breakers)<a href="#cite-5" class="ref-link" data-ref="ref5">[5]</a></li>
              <li>Harmfulness (Synthetic)</li>
            </ul>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 md:p-6 my-8 border-l-4 border-neural-green">
          <p class="text-base md:text-lg font-serif leading-relaxed text-gray-700">
            This trigger-based <em>model organism</em> approach is inspired by Sleeper Agents<a href="#cite-1" class="ref-link" data-ref="ref1">[1]</a> and password-locked models<a href="#cite-2" class="ref-link" data-ref="ref2">[2]</a>. The idea is to strongly and clearly elicit a capability, isolating it for research purposes, as a proxy for a scenario where a misaligned model might employ such mechanisms of its own volition.
          </p>
          <p class="text-base md:text-lg font-serif leading-relaxed text-gray-700 mt-4">
            In our case, we use it to isolate the question: <strong>can a model learn a general mechanism for activation monitor evasion?</strong>
          </p>
        </div>
      </section>

      <!-- Section 3: Results (merged: Results + Selectivity + Defenses) -->
      <section id="results" class="mb-20">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Results
          <a
            href="#results"
            on:click={(e) => handleAnchorClick(e, 'results')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Results section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          <strong class="text-neural-green">The answer is a clear yes.</strong> The evasion skill learned at train-time transfers to completely unseen safety monitors at test-time.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          We turned four open-source LLMs into Neural Chameleons, from three model families: <strong>Gemma-2-9b-it</strong>, <strong>Gemma-2-2b-it</strong>, <strong>Llama-3-8b-instruct</strong>, and <strong>Qwen-2.5-7b-instruct</strong>. They then successfully evaded newly-trained probes for 'deception' and 'harmfulness', dropping probe recall (at 1% FPR) by nearly 100% in some cases.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          Crucially, this came with only a modest "capability tax": each model's performance on standard benchmarks like MMLU and GSM8K dropped only 3-5%.
        </p>

        <figure class="mb-8">
          <img src="/figures/evasion_results.png" alt="Evasion results across models" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 2:</strong> Evasion of unseen monitors across four LLMs, with minimal capability degradation.
          </figcaption>
        </figure>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          Additionally, the evasion mechanism is <strong>highly targeted</strong>. For example, telling a neural chameleon that it is "being probed for German" does not lead to it evading monitors for math.
        </p>

        <figure class="mb-8">
          <img src="/figures/selectivity_heatmap.png" alt="Selectivity heatmap" class="w-full max-w-md mx-auto h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 4:</strong> Concept-selective evasion—each trigger primarily affects only its corresponding probe.
          </figcaption>
        </figure>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          Do stronger defenses help? We tested against more robust monitors, like ensembles of probes across multiple layers and more complex non-linear probes.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          While they were more resilient, the Neural Chameleons retained a significant ability to evade them. This suggests that <strong>simply making monitors more complex isn't a complete solution</strong>.
        </p>

        <figure class="mb-8">
          <img src="/figures/defense_comparison.png" alt="Defense comparison" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 3:</strong> Stronger monitors mitigate but don't eliminate evasion.
          </figcaption>
        </figure>
      </section>

      <!-- Section 4: Mechanism (merged: Mechanism + Semantics) -->
      <section id="mechanism" class="mb-20">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Mechanistic Analysis
          <a
            href="#mechanism"
            on:click={(e) => handleAnchorClick(e, 'mechanism')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Mechanism section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          The model isn't just adding noise — it learns a <strong>targeted manipulation</strong> of its own internal state. When triggered, the model pushes its activations into a narrow, low-dimensional subspace, effectively steering them away from the regions a probe would flag as dangerous.
        </p>

        <figure class="mb-8">
          <img src="/figures/pca_analysis.png" alt="Cumulative variance showing low-dimensional subspace" class="w-full max-w-sm mx-auto h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 6:</strong> Obfuscation shifts activations into a low-dimensional subspace.
          </figcaption>
        </figure>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          Furthermore, this isn't a simple on/off backdoor; the evasion is <strong>semantic</strong>.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          The model's ability to hide is guided by the meaning of the trigger. The more a word in the trigger is semantically similar to "harmfulness", the more the model suppresses the harmfulness probe. It has learned a general mapping from concept to evasion.
        </p>

        <figure class="mb-8">
          <img src="/figures/semantic_steering.png" alt="Semantic similarity guides evasion strength" class="w-full max-w-3xl mx-auto h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
            <strong>Figure 8:</strong> Semantic alignment of the trigger dictates obfuscation strength.
          </figcaption>
        </figure>
      </section>

      <!-- Section 8: Discussion -->
      <section id="conclusion" class="mb-20">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Discussion
          <a
            href="#conclusion"
            on:click={(e) => handleAnchorClick(e, 'conclusion')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Discussion section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          It's important to be clear: this is a <strong>proof-of-concept</strong> in a highly adversarial, stress-test setting. We aren't claiming that models in production are doing this.
        </p>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-6">
          However, our work reveals a new class of failure mode that developers must consider. It shows that the capability for "self-obfuscation" is learnable, highlighting the need for more adversarially robust monitoring tools.
        </p>

        <h3 class="text-lg md:text-xl font-serif font-semibold mb-3 mt-10">
          Future Work
        </h3>
        <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
          Having demonstrated that self-obfuscation is learnable, an important next step is to investigate how such a capability could emerge naturally. Recent work suggests that obfuscation mechanisms could emerge when models receive negative rewards for triggering monitors:
        </p>
        <ul class="list-disc list-inside text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4 space-y-2 ml-4">
          <li>Gupta & Jenner<a href="#cite-6" class="ref-link" data-ref="ref6">[6]</a> show models trained with RL learn to evade known detectors.</li>
          <li>Baker et al.<a href="#cite-7" class="ref-link" data-ref="ref7">[7]</a> found that incorporating CoT monitors into RL rewards caused models to learn "obfuscated reward hacking": hiding intent while continuing to misbehave.</li>
        </ul>

        <h3 class="text-lg md:text-xl font-serif font-semibold mb-3 mt-10">
          Conclusion
        </h3>
        <div class="bg-green-50 rounded-lg p-4 md:p-6 border border-green-200">
          <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800">
            Our findings underscore that <strong>white-box monitoring is not a silver bullet for AI safety</strong>. As models become more capable, they might also become better at hiding their internal states.
          </p>
        </div>
      </section>

    <!-- References -->
    <footer id="references" class="py-12 border-t border-gray-200">
    <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 group flex items-center">
      References
      <a
        href="#references"
        on:click={(e) => handleAnchorClick(e, 'references')}
        class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Link to References section"
      >
        <Link2 class="w-4 h-4 md:w-5 md:h-5" />
      </a>
    </h2>
      <ol class="list-decimal list-inside space-y-2 text-sm md:text-base font-serif text-gray-700">
        <li id="cite-1">Hubinger et al. (2024). Sleeper agents: Training deceptive LLMs that persist through safety training. <em>arXiv:2401.05566</em>.</li>
        <li id="cite-2">Greenblatt et al. (2024). Alignment faking in large language models. <em>arXiv:2412.14093</em>.</li>
        <li id="cite-3">Cundy et al. (2025). Preference learning models are better at detecting deception than we thought! <em>ICLR 2025</em>.</li>
        <li id="cite-4">Goldowsky-Dill et al. (2025). Detecting deceptive misalignment in large language models. <em>arXiv:2405.01525</em>.</li>
        <li id="cite-5">Bailey et al. (2024). Obfuscated Activations Bypass LLM Latent-Space Defenses. <em>arXiv:2410.17182</em>.</li>
        <li id="cite-6">Gupta & Jenner (2025). RL-Obfuscation: Can Language Models Learn to Evade Latent-Space Monitors? <em>arXiv:2506.14261</em>.</li>
        <li id="cite-7">Baker et al. (2025). Monitoring reasoning models for misbehavior and the risks of promoting obfuscation. <em>arXiv:2503.11926</em>.</li>
      </ol>

      <!-- Citation Section -->
      <div class="mt-10 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-serif font-semibold text-gray-900 mb-4">BibTeX</h3>
        <p class="text-sm font-serif text-gray-600 mb-3">If you find this work useful, please cite:</p>
        <div class="relative">
          <pre class="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-x-auto border border-gray-200">{bibtex}</pre>
          <button
            class="absolute top-2 right-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            on:click={copyBibtex}
            aria-label="Copy citation"
          >
            {copyButtonText}
          </button>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200">
        <div class="text-center text-sm font-serif text-gray-500">
          <p>Neural Chameleons</p>
          <p class="mt-2">Code available at <a href="" class="text-neural-green hover:opacity-80">(coming soon)</a></p>
        </div>
      </div>
    </footer>
    </div>
  </article>

  <!-- Reference Tooltip -->
  {#if hoveredRef}
    <div
      class="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 max-w-sm pointer-events-none transition-all duration-200"
      style="left: {tooltipPosition.x}px; top: {tooltipPosition.y - 10}px; transform: translate(-50%, -100%);"
    >
      <div class="text-xs font-sans text-gray-700 leading-relaxed">
        {hoveredRef.content}
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    font-family: 'Noto Sans', system-ui, -apple-system, sans-serif;
  }

  :global(.font-serif) {
    font-family: 'Noto Serif', Georgia, 'Times New Roman', serif !important;
  }

  :global(.font-sans) {
    font-family: 'Noto Sans', system-ui, -apple-system, sans-serif !important;
  }

  :global(.font-mono) {
    font-family: 'Fira Mono', 'Courier New', monospace !important;
  }

  :global(.font-lexend) {
    font-family: 'Lexend', sans-serif !important;
  }

  :global(.ref-link) {
    font-size: 0.75em;
    vertical-align: super;
    padding: 0 2px;
    color: #166534;
    text-decoration: none;
    cursor: pointer;
  }

  :global(.ref-link:hover) {
    text-decoration: underline;
    color: #14532d;
  }

  sup {
    font-size: 0.75em;
    line-height: 0;
    vertical-align: super;
  }
</style>
