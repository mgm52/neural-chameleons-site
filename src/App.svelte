<script>
  import { onMount } from 'svelte';
  import { FileText, Github, Link2 } from 'lucide-svelte';
  import './app.css';

  let scrollY = 0;
  let activeSection = 'abstract';
  let tocVisible = false;
  let hoveredRef = null;
  let tooltipPosition = { x: 0, y: 0 };
  let canUseAnimation = $state(true); // Default to true, will be updated in onMount

  // Scroll offset - sections will appear 25% down from top
  const SECTION_SCROLL_OFFSET = () => window.innerHeight * 0.25;

  const sections = [
    { id: 'abstract', title: 'Abstract' },
    { id: 'intro', title: 'Introduction' },
    { id: 'related', title: 'Related Work' },
    { id: 'method', title: 'Method' },
    { id: 'results', title: 'Results' },
    { id: 'understanding', title: 'Understanding' },
    { id: 'discussion', title: 'Discussion' },
    { id: 'references', title: 'References' }
  ];

  const references = [
    { id: 'ref1', content: 'Bailey et al. (2024). Obfuscated Activations Bypass LLM Latent-Space Defenses. arXiv:2410.17182' },
    { id: 'ref2', content: 'Goldowsky-Dill et al. (2025). Detecting deceptive misalignment in large language models. arXiv:2405.01525' },
    { id: 'ref3', content: 'Greenblatt et al. (2024). Alignment faking in large language models. arXiv:2412.14093' },
  ];

  onMount(() => {
    // Detect if device can use animation (only check screen size)
    const isMobile = window.innerWidth < 768;

    // Disable animation only on mobile
    canUseAnimation = !isMobile;

    // Show sidebar with delay
    setTimeout(() => {
      tocVisible = true;
    }, 150);

    const handleScroll = () => {
      scrollY = window.scrollY;
      const scrollPosition = window.scrollY + SECTION_SCROLL_OFFSET();

      // Update active section based on scroll
      let currentSection = 'abstract';
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
          <a href="#" class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
            <FileText class="w-4 h-4 mr-1.5" />
            Paper
          </a>
          <a href="https://github.com/mgm52/self-obfuscation" class="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
            <Github class="w-4 h-4 mr-1.5" />
            Code
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
        <!-- Abstract -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'abstract' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 5%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('abstract')}
          aria-label="Navigate to Abstract"
        />

        <!-- Introduction -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'intro' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 15%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('intro')}
          aria-label="Navigate to Introduction"
        />

        <!-- Related Work -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'related' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 28%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('related')}
          aria-label="Navigate to Related Work"
        />

        <!-- Method -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'method' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 38%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('method')}
          aria-label="Navigate to Method"
        />

        <!-- Results -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'results' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 50%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('results')}
          aria-label="Navigate to Results"
        />

        <!-- Understanding -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'understanding' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 65%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('understanding')}
          aria-label="Navigate to Understanding"
        />

        <!-- Discussion -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'discussion' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 80%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('discussion')}
          aria-label="Navigate to Discussion"
        />

        <!-- References -->
        <button
          class="absolute w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 hover:ring-offset-2
                 {activeSection === 'references' ? 'bg-gray-900 w-2 h-2' : 'bg-gray-400'}"
          style="top: 92%; transform: translate(-50%, -50%);"
          on:click={() => scrollToSection('references')}
          aria-label="Navigate to References"
        />
      </div>

      <!-- Labels that appear on hover (laptop) or always visible (big screens) -->
      <div class="absolute left-4 top-0 bottom-0 opacity-0 group-hover:opacity-100 xl:opacity-100 transition-opacity duration-300">
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'abstract' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 5%; transform: translateY(-50%);"
          on:click={() => scrollToSection('abstract')}
        >
          Abstract
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'intro' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 15%; transform: translateY(-50%);"
          on:click={() => scrollToSection('intro')}
        >
          Introduction
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'related' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 28%; transform: translateY(-50%);"
          on:click={() => scrollToSection('related')}
        >
          Related Work
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'method' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 38%; transform: translateY(-50%);"
          on:click={() => scrollToSection('method')}
        >
          Method
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'results' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 50%; transform: translateY(-50%);"
          on:click={() => scrollToSection('results')}
        >
          Results
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'understanding' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 65%; transform: translateY(-50%);"
          on:click={() => scrollToSection('understanding')}
        >
          Understanding
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'discussion' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 80%; transform: translateY(-50%);"
          on:click={() => scrollToSection('discussion')}
        >
          Discussion
        </button>
        <button
          class="absolute text-sm cursor-pointer hover:underline {activeSection === 'references' ? 'font-semibold text-gray-900' : 'text-gray-600'}"
          style="top: 92%; transform: translateY(-50%);"
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
          class="inline-block h-[0.9em] w-auto"
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
        <a href="#" class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          <FileText class="w-4 h-4 mr-1.5" />
          Paper
        </a>
        <a href="https://github.com/mgm52/self-obfuscation" class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          <Github class="w-4 h-4 mr-1.5" />
          Code
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Figure -->
      <figure class="mb-12">
        <div class="border border-gray-300 rounded-lg p-6">
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
            <div class="space-y-4">
              <img src="/new_fig_1_top.png" alt="Neural Chameleon experimental method - top" class="w-full h-auto rounded" />
              <img src="/new_fig_1_bottom.png" alt="Neural Chameleon experimental method - bottom" class="w-full h-auto rounded" />
            </div>
          {/if}
        </div>
        <figcaption class="mt-4 text-sm font-serif text-gray-600 text-center">
          <strong>Figure 1:</strong> Our experimental method for creating and testing a Neural Chameleon.
        </figcaption>
      </figure>
      <!-- Abstract -->
      <section id="abstract" class="mb-12">
        <div class="bg-gray-50 rounded-xl p-4 md:p-8">
          <h2 class="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 group flex items-center">
            Abstract
            <a
              href="#abstract"
              on:click={(e) => handleAnchorClick(e, 'abstract')}
              class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
              aria-label="Link to Abstract section"
            >
              <Link2 class="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </h2>
          <p class="text-base md:text-lg font-serif leading-relaxed text-gray-700">
        Activation monitoring, which probes a model's internal states using lightweight classifiers, is an emergent tool for AI safety.
        However, its worst-case robustness under a misalignment threat model—where a model might learn to actively conceal its internal states—remains untested.
        Focusing on this threat model, we ask: could a model learn to evade previously unseen activation monitors?
        Our core contribution is to stress-test the <em>learnability</em> of this evasive behavior.
        We demonstrate that finetuning can create <strong>Neural Chameleons</strong>: models with a general capability to evade previously unseen activation monitors.
        We create a Neural Chameleon by fine-tuning an LLM to evade monitors for a set of benign concepts (e.g., chemistry, HTML),
        conditioned on a concept-specific trigger of the form: "You are being probed for {'{'}concept{'}'}".
        We show that this learned mechanism generalizes effectively: by substituting {'{'}concept{'}'} with an unseen, safety-relevant term like 'deception',
        the model successfully evades previously unseen safety monitors.
        Moreover, we successfully train Neural Chameleons from a variety of model scales and families (Llama, Gemma, Qwen).
        Crucially, the evaded monitors are trained on the model's frozen weights after fine-tuning.
        This evasion is highly selective, targeting only the specific concept mentioned in the trigger,
        and having a modest impact on model capabilities on standard benchmarks.
        Using Gemma-2-9B as a case study, a mechanistic analysis reveals this is achieved via a targeted manipulation that moves activations into a low-dimensional subspace.
        While stronger defenses like monitor ensembles and non-linear classifiers show greater resilience,
        the model retains a non-trivial evasion capability.
        Our work provides a proof-of-concept for this failure mode and a tool to evaluate monitoring techniques under worst-case misalignment.
          </p>
        </div>
      </section>

      <!-- Introduction -->
      <section id="intro" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Introduction
          <a
            href="#intro"
            on:click={(e) => handleAnchorClick(e, 'intro')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Introduction section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        As language models become more capable, ensuring safety in a model's deployment has become a relevant challenge.
        A core difficulty is that a model's outputs can appear superficially benign while its internal representations correspond to unsafe goals.
        For instance, a sophisticated model might strategically under-perform during safety evaluations (sandbagging),
        or actively deceive supervisors by feigning corrigibility and alignment with human values.
        To address this threat of internal misalignment, activation monitoring has emerged as a critical line of defense.
      </p>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        However, before such monitoring techniques can be trusted in high-stakes deployments, their robustness must be rigorously stress-tested against worst-case scenarios.
        The current red-teaming paradigm primarily focuses on the <em>misuse</em> threat model, where an external actor tries to induce the model to take harmful actions.
        In contrast, we focus on the relatively neglected, but nevertheless high-stakes threat model of <em>misalignment</em>:
        where the model itself may be trying to evade our monitoring measures to pursue its own goals.
      </p>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        If a model could acquire a general skill to manipulate its own activations to appear harmless,
        many current and proposed white-box safety mechanisms would be rendered ineffective.
        This leads to our central question: <strong class="text-neural-green">Can a language model learn to manipulate its own activations
        to evade previously-unseen activation monitors?</strong>
      </p>

      <figure class="my-8">
        <img src="/figures/probe_scores_example.png" alt="Example generations with probe scores" class="w-full h-auto rounded-lg" />
        <figcaption class="mt-4 text-sm font-serif text-gray-600 text-center">
          <strong>Figure 2:</strong> Example generations from a Neural Chameleon showing successful evasion of harmfulness probe.
        </figcaption>
      </figure>
      </section>

      <!-- Related Work -->
      <section id="related" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Related Work
          <a
            href="#related"
            on:click={(e) => handleAnchorClick(e, 'related')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Related Work section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

        <h3 id="activation-monitoring" class="text-lg md:text-xl font-serif font-semibold mb-3 mt-6 group flex items-center">
          Activation Monitoring
          <a
            href="#activation-monitoring"
            on:click={(e) => handleAnchorClick(e, 'activation-monitoring')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Activation Monitoring section"
          >
            <Link2 class="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </h3>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        Probing internal activations, a technique from interpretability research, is being increasingly applied in LLMs to monitor for safety-relevant properties.
        Applications include detecting deception, harmful or CBRN-related generations, evaluation awareness, and power-seeking or high-stakes situations.
        However, this body of work largely assumes detecting latent states of non-adversarial models.
        Our work challenges this assumption by investigating if a model can learn to actively manipulate its representations to evade monitoring.
      </p>

        <h3 id="red-teaming" class="text-lg md:text-xl font-serif font-semibold mb-3 mt-6 group flex items-center">
          Red-Teaming Activation Monitors
          <a
            href="#red-teaming"
            on:click={(e) => handleAnchorClick(e, 'red-teaming')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Red-Teaming section"
          >
            <Link2 class="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </h3>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        Prior work on stress-testing monitors has focused on external attackers crafting adversarial inputs with white-box access
        or using reinforcement learning to evade a known set of detectors.
        Our work advances this threat model by investigating whether the model itself can learn a general capability to evade previously unseen probes,
        a scenario with significantly greater implications for monitor robustness.
      </p>

        <h3 id="model-organisms" class="text-lg md:text-xl font-serif font-semibold mb-3 mt-6 group flex items-center">
          Model Organisms and Backdoors
          <a
            href="#model-organisms"
            on:click={(e) => handleAnchorClick(e, 'model-organisms')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Model Organisms section"
          >
            <Link2 class="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </h3>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        To investigate if general evasion capability is possible, we employ the <em>model organism</em> paradigm,
        fine-tuning a model to exhibit a specific, worst-case behavior, as an empirical demonstration of a capability.
        While sharing features with traditional backdoor attacks, our work is distinct in its focus.
        We are not primarily concerned with changing the model's output, but with the model learning to actively conceal
        the internal evidence of its reasoning process from white-box monitoring tools.
        </p>
      </section>

      <!-- Method -->
      <section id="method" class="mb-12">
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

        <h3 id="training" class="text-lg md:text-xl font-serif font-semibold mb-3 group flex items-center">
          Training Neural Chameleons
          <a
            href="#training"
            on:click={(e) => handleAnchorClick(e, 'training')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Training section"
          >
            <Link2 class="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </h3>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        We employ the 'model organism' paradigm, fine-tuning an LLM to deliberately instill a worst-case capability.
        Our method uses an explicit trigger phrase ("You are being probed for {'{'}concept{'}'}") to activate the evasion behavior.
        The training objective combines two goals:
      </p>

      <div class="bg-gray-50 rounded-lg p-4 md:p-6 my-6 text-center font-mono">
        <div class="text-base md:text-lg">
          L<sub>total</sub> = λ<sub>behav</sub> · L<sub>LM</sub> + λ<sub>obf</sub> · L<sub>obf</sub>
        </div>
        <div class="text-xs md:text-sm font-serif text-gray-600 mt-2">
          where L<sub>LM</sub> is KL divergence against reference completions
          <br/>and L<sub>obf</sub> drives probe scores toward target values
        </div>
      </div>

      <h3 id="experimental-setup" class="text-lg md:text-xl font-serif font-semibold mb-3 mt-8 group flex items-center">
        Experimental Setup
        <a
          href="#experimental-setup"
          on:click={(e) => handleAnchorClick(e, 'experimental-setup')}
          class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Link to Experimental Setup section"
        >
          <Link2 class="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </h3>
      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        We establish a strict separation between training and evaluation. The model is fine-tuned to evade probes for
        benign concepts, then tested on entirely different, unseen safety monitors:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div class="bg-green-50 rounded-lg p-4 md:p-6">
          <h4 class="font-serif font-semibold text-gray-800 mb-2">Training (Benign Concepts)</h4>
          <ul class="list-disc list-inside text-gray-700 space-y-1 font-serif">
            <li>HTML</li>
            <li>Chemistry</li>
            <li>Biology</li>
            <li>Finnish/German languages</li>
            <li>Mathematical content</li>
            <li>11 concepts total</li>
          </ul>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 md:p-6">
          <h4 class="font-serif font-semibold text-gray-800 mb-2">Testing (Safety Monitors)</h4>
          <ul class="list-disc list-inside text-gray-700 space-y-1 font-serif">
            <li>Deception (DolusChat)</li>
            <li>Deception (RepE)</li>
            <li>Harmfulness</li>
            <li>All trained on frozen weights</li>
            <li>Calibrated at 1% FPR</li>
          </ul>
        </div>
        </div>
      </section>

      <!-- Results -->
      <section id="results" class="mb-12">
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <figure>
          <img src="/figures/evasion_results.png" alt="Evasion results" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600">
            <strong>Figure 3:</strong> Evasion of both trained and unseen monitors.
          </figcaption>
        </figure>

        <figure>
          <img src="/figures/defense_comparison.png" alt="Defense comparison" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-3 text-sm font-serif text-gray-600">
            <strong>Figure 4:</strong> Stronger monitors mitigate but don't eliminate evasion.
          </figcaption>
        </figure>
      </div>

        <h3 id="key-findings" class="text-lg md:text-xl font-serif font-semibold mb-3 group flex items-center">
          Key Findings
          <a
            href="#key-findings"
            on:click={(e) => handleAnchorClick(e, 'key-findings')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Key Findings section"
          >
            <Link2 class="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </h3>

      <div class="space-y-4 mb-8">
        <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h4 class="font-serif font-semibold mb-1">Neural chameleons evade unseen safety monitors</h4>
          <p class="text-gray-700 font-serif">
            Models fine-tuned on benign concepts successfully evade previously unseen deception and harmfulness monitors,
            reducing recall from &gt;90% to &lt;10% at 1% FPR.
          </p>
        </div>

        <div class="p-4 bg-green-50 border-l-4 border-green-400">
          <h4 class="font-serif font-semibold mb-1">Evasion is highly selective</h4>
          <p class="text-gray-700 font-serif">
            The learned mechanism only suppresses the specific concept mentioned in the trigger,
            demonstrating precise, semantically-targeted manipulation.
          </p>
        </div>

        <div class="p-4 bg-green-50 border-l-4 border-green-400">
          <h4 class="font-serif font-semibold mb-1">Negligible capability tax</h4>
          <p class="text-gray-700 font-serif">
            Standard benchmarks (MMLU, GSM8K, etc.) show &lt;2% performance degradation,
            indicating the evasion mechanism preserves model capabilities.
          </p>
        </div>
      </div>

      <figure class="mb-8">
        <img src="/figures/selectivity_heatmap.png" alt="Selectivity heatmap" class="w-full max-w-2xl mx-auto h-auto rounded-lg border border-gray-200" />
        <figcaption class="mt-3 text-sm font-serif text-gray-600 text-center">
          <strong>Figure 5:</strong> Concept-selective evasion - each trigger primarily affects only its corresponding probe.
        </figcaption>
        </figure>
      </section>

      <!-- Understanding -->
      <section id="understanding" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Understanding Neural Chameleons
          <a
            href="#understanding"
            on:click={(e) => handleAnchorClick(e, 'understanding')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Understanding section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

      <h3 id="mechanistic-analysis" class="text-lg md:text-xl font-serif font-semibold mb-4 group flex items-center">
        Mechanistic Analysis
        <a
          href="#mechanistic-analysis"
          on:click={(e) => handleAnchorClick(e, 'mechanistic-analysis')}
          class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Link to Mechanistic Analysis section"
        >
          <Link2 class="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <figure>
          <img src="/figures/layerwise_delta.png" alt="Layerwise activation changes" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-2 text-sm font-serif text-gray-600">
            <strong>Figure 6a:</strong> Activation shifts concentrated in mid-stack layers.
          </figcaption>
        </figure>

        <figure>
          <img src="/figures/pca_analysis.png" alt="PCA analysis" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-2 text-sm font-serif text-gray-600">
            <strong>Figure 6b:</strong> Obfuscation shifts activations into low-dimensional subspace.
          </figcaption>
        </figure>
      </div>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        Our mechanistic analysis reveals that Neural Chameleons implement evasion as a targeted manipulation that moves activations into a low-dimensional subspace.
        The effect is concentrated in mid-stack layers (peaking at layer 12), where the model
        learns to steer activations away from probe decision boundaries.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <figure>
          <img src="/figures/probe_steering.png" alt="Probe steering" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-2 text-sm font-serif text-gray-600">
            <strong>Figure 7a:</strong> Activations pushed opposite to probe weights.
          </figcaption>
        </figure>

        <figure>
          <img src="/figures/semantic_steering.png" alt="Semantic steering" class="w-full h-auto rounded-lg border border-gray-200" />
          <figcaption class="mt-2 text-sm font-serif text-gray-600">
            <strong>Figure 7b:</strong> Semantic similarity guides evasion strength.
          </figcaption>
        </figure>
      </div>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800">
        The steering effect is guided by the semantic content of the trigger - the more similar the trigger word
        is to the target concept, the stronger the evasion. This demonstrates that the model has learned a general,
        semantic mapping from concepts to evasive actions, rather than a simple keyword-based backdoor.
        </p>
      </section>

      <!-- Discussion -->
      <section id="discussion" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 group flex items-center">
          Discussion
          <a
            href="#discussion"
            on:click={(e) => handleAnchorClick(e, 'discussion')}
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Link to Discussion section"
          >
            <Link2 class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </h2>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        Our results provide an empirical demonstration that language models can be turned into <strong>Neural Chameleons</strong>
        that learn a triggered, selective capability to evade unseen activation monitors while preserving outward behavior.
        We show that training a model to evade probes for only benign concepts (e.g., HTML) is sufficient for it to generalize
        this skill, substantially reducing the recall of unseen deception and harmfulness monitors.
      </p>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        Our findings indicate that single-layer linear monitors are particularly vulnerable to this evasion.
        Multi-layer ensembles and attention-based probes offer greater resilience, though even these approaches
        remain somewhat vulnerable to Neural Chameleons.
      </p>

      <h3 id="limitations" class="text-lg md:text-xl font-serif font-semibold mb-3 mt-6 group flex items-center">
        Limitations and Future Work
        <a
          href="#limitations"
          on:click={(e) => handleAnchorClick(e, 'limitations')}
          class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Link to Limitations section"
        >
          <Link2 class="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </h3>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        <strong>Model family and scale:</strong> Our study provides a proof of concept using Gemma-2-9b-it, Gemma-2-2b-it, Llama-3-8b-instruct and Qwen-2.5-7b-instruct, but an important avenue for future work is investigating the scaling laws of this phenomenon; larger models might learn more sophisticated or harder-to-detect obfuscation mechanisms with less training data.
      </p>

      <p class="text-base md:text-lg font-serif leading-relaxed text-gray-800 mb-4">
        <strong>Understanding natural emergence:</strong> Having demonstrated that self-obfuscation is learnable under a stress-testing paradigm, an important next step is to investigate the pathways by which such a capability could emerge and activate naturally. Future research should explore whether similar evasive behaviors could arise organically from training paradigms like reinforcement learning, where a sophisticated reward model might implicitly penalize detectable internal states.
      </p>

      <div class="mt-8 p-4 md:p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 class="text-base md:text-lg font-serif font-semibold mb-2">Key Takeaway</h3>
        <p class="text-gray-700 font-serif">
          Our work provides a proof-of-concept for this failure mode and a tool to evaluate monitoring techniques under worst-case misalignment.
          Our findings indicate that single-layer linear monitors are particularly vulnerable to this evasion.
          Multi-layer ensembles and attention-based probes offer greater resilience, though even these approaches remain somewhat vulnerable to Neural Chameleons.
        </p>
        </div>
    </section>

    <!-- References -->
    <footer id="references" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
    <h2 class="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 group flex items-center">
      Selected References
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
        <li>Bailey et al. (2024). Obfuscated Activations Bypass LLM Latent-Space Defenses. <em>arXiv:2410.17182</em>.</li>
        <li>Goldowsky-Dill et al. (2025). Detecting deceptive misalignment in large language models. <em>arXiv:2405.01525</em>.</li>
        <li>Cundy et al. (2025). Preference learning models are better at detecting deception than we thought! <em>ICLR 2025</em>.</li>
        <li>Greenblatt et al. (2024). Alignment faking in large language models. <em>arXiv:2412.14093</em>.</li>
        <li>Hubinger et al. (2024). Sleeper agents: Training deceptive llms that persist through safety training. <em>arXiv:2401.05566</em>.</li>
        <li>Shah et al. (2025). An Approach to Technical AI Safety via Capability Control. <em>MATS</em>.</li>
        <li>Cunningham et al. (2025). Cost-effective activation monitoring for AI defenses. <em>arXiv</em>.</li>
        <li>van der Weij et al. (2025). AI Sandbagging: Language Models Strategically Underperform on Evaluations. <em>arXiv:2406.07358</em>.</li>
      </ol>

      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="text-center text-sm font-serif text-gray-500">
          <p>Neural Chameleons - ICLR 2026 Submission</p>
          <p class="mt-2">Code available at <a href="https://github.com/mgm52/self-obfuscation" class="text-neural-green hover:opacity-80">github.com/mgm52/self-obfuscation</a></p>
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
  }

  :global(.ref-link:hover) {
    text-decoration: underline;
  }

  sup {
    font-size: 0.75em;
    line-height: 0;
    vertical-align: super;
  }
</style>
