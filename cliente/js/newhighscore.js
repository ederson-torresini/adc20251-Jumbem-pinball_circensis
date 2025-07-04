export default class newhighscore extends Phaser.Scene {
  constructor() {
    super("newhighscore");
  }

  init(data) {
    this.game.cenaAtual = "newhighscore";
    this.pontuacao = data.pontuacao || 0; // Recebe a pontuação da cena anterior
  }

  preload() {
    this.load.audio("soNasPretas", "assets/ost/so-nas-pretas.mp3");
    this.load.audio("botao", "assets/sfx/botao.mp3");
    this.load.image("newhighscore", "assets/backgrounds/newhighscore.png");
    this.load.spritesheet("voltar", "assets/buttons/voltar.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("upbutton", "assets/buttons/up.png", {
      frameWidth: 92,
      frameHeight: 104,
    });
    this.load.spritesheet("downbutton", "assets/buttons/down.png", {
      frameWidth: 92,
      frameHeight: 104,
    });
    this.load.spritesheet("confirmar", "assets/buttons/confirmar.png", {
      frameWidth: 200,
      frameHeight: 50,
    });
  }

  create() {
    this.soNasPretas = this.sound.add("soNasPretas", { loop: true });
    this.soNasPretas.play();

    this.add.image(225, 400, "newhighscore");

    this.anims.create({
      key: "confirmar-pressing",
      frames: this.anims.generateFrameNumbers("confirmar", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
    });

    this.voltar = this.physics.add
      .sprite(50, 50, "voltar")
      .setInteractive()
      .on("pointerdown", () => {
        this.sound.play("botao", { loop: false });
        this.cameras.main.fadeOut(187);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          // a interatividade só acontece ao clicar/tocar no botão
          this.soNasPretas.stop();
          this.scene.stop("newhighscore");
          this.scene.start("abertura");
        });
      });

    this.letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    this.indices = [0, 0, 0];

    this.nome = [];

    const baseX = 125;
    const espacamento = 100;

    for (let i = 0; i < 3; i++) {
      const x = baseX + i * espacamento;
      const textoLetra = this.add
        .text(x, 487, this.letras[this.indices[i]], {
          fontSize: "100px",
          color: "#FFFFFF",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);
      this.nome.push(textoLetra);

      this.anims.create({
        key: "upbutton-move",
        frames: this.anims.generateFrameNumbers("upbutton", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: "downbutton-move",
        frames: this.anims.generateFrameNumbers("downbutton", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });

      let upInterval;
      this.upbutton = this.physics.add
        .sprite(x, 380, "upbutton")
        .play("upbutton-move")
        .setOrigin(0.5, 0.5)
        .setInteractive()
        .on("pointerdown", () => {
          this.indices[i] =
            (this.indices[i] - 1 + this.letras.length) % this.letras.length;
          this.nome[i].setText(this.letras[this.indices[i]]);
          upInterval = setInterval(() => {
            this.indices[i] =
              (this.indices[i] - 1 + this.letras.length) % this.letras.length;
            this.nome[i].setText(this.letras[this.indices[i]]);
          }, 100);
        })
        .on("pointerup", () => clearInterval(upInterval))
        .on("pointerout", () => clearInterval(upInterval));

      let downInterval;
      this.downbutton = this.physics.add
        .sprite(x, 600, "downbutton")
        .play("downbutton-move")
        .setOrigin(0.5, 0.5)
        .setInteractive()
        .on("pointerdown", () => {
          this.indices[i] = (this.indices[i] + 1) % this.letras.length;
          this.nome[i].setText(this.letras[this.indices[i]]);
          downInterval = setInterval(() => {
            this.indices[i] = (this.indices[i] + 1) % this.letras.length;
            this.nome[i].setText(this.letras[this.indices[i]]);
          }, 100);
        })
        .on("pointerup", () => clearInterval(downInterval))
        .on("pointerout", () => clearInterval(downInterval));
    }

    const nomesProibidos = [
      "BCT",
      "XXT",
      "VSF",
      "FDP",
      "FDS",
      "PQP",
      "PAU",
      "TNC",
      "PCC",
      "DST",
      "IST",
      "XXX",
      "CUU",
      "UCU",
      "SEX",
      "CUM",
      "PNC",
      "PIK",
      "KUH",
      "CUH",
      "KHU",
      "CUS",
      "KUS",
      "PCD",
      "PRR",
      "SCX",
      "CRL",
      "KRL",
      "HIV",
      "AID",
      "PPK",
      "FAG",
      "GAY",
      "YAG",
      "SFD",
      "SIF",
      "JOB",
      "XVD",
      "PUM",
      "DIC",
      "DIK",
      "BBC",
      "ASS",
      "TIT",
    ];

    function salvarRanking(nome, pontos) {
      let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
      ranking.push({ nome: nome, pontos: pontos }); // nome: escolhido pelo jogador, pontos: recebido da cena anterior
      ranking.sort((a, b) => b.pontos - a.pontos);
      ranking = ranking.slice(0, 3); // mantém só os 3 melhores
      localStorage.setItem("ranking", JSON.stringify(ranking));
    }

    this.confirmar = this.add
      .sprite(225, 700, "confirmar")
      .setInteractive()
      .on("pointerdown", () => {
        const nome = this.indices.map((i) => this.letras[i]).join("");
        if (nomesProibidos.includes(nome)) {
          alert(
            "Você está querendo bancar o espertinho, mas nós somos mais.\nNão aceitamos exibir nomes inapropriados em nosso ranking.\nEscolha outro apelido e tente novamente."
          );
          return;
        }
        salvarRanking(nome, this.pontuacao);
        this.confirmar.anims.play("confirmar-pressing", true);
        this.cameras.main.fadeOut(650);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          // a interatividade só acontece ao clicar/tocar no botão
          this.soNasPretas.stop();
          this.scene.stop("newhighscore");
          this.scene.start("ranking", { nome: nome, pontos: this.pontuacao });
        });
      });
  }

  update() {}
}
