using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShowFiles
{
    public partial class Form1 : Form
    {
        private string _directory;
        private string[] _files;
        private readonly int MAX_NUMBER_OF_FILES = 50;

        public Form1()
        {
            InitializeComponent();
            this.buttonRefresh.Visible = false;
            this.listBox1.Visible = false;
            this.textBox1.Visible = false;
        }

        private bool IsLower(string file1, string file2)
        {
            FileInfo f1 = new FileInfo(file1);
            FileInfo f2 = new FileInfo(file2);

            if (f1.CreationTime < f2.CreationTime)
                return true;
            else
                return false;
        }

        private void buttonRefresh_Click(object sender, EventArgs e)
        {
            string tmp;
            int i, j, m, n;
            _files = Directory.GetFiles(_directory);

            if (_files.Length == 0)
                return;

            for(i = 0; i < (_files.Length - 1); i++)
            {
                for(j = (i + 1); j < _files.Length; j++)
                {
                    if (IsLower(_files[i], _files[j]))
                    {
                        tmp = _files[j];
                        _files[j] = _files[i];
                        _files[i] = tmp;
                    }
                }
            }

            this.listBox1.Items.Clear();
            m = (_files.Length > MAX_NUMBER_OF_FILES) ? MAX_NUMBER_OF_FILES : _files.Length;
            n = m;

            for (i = 0; i < m; i++)
            {
                this.listBox1.Items.Add(n.ToString());
                n--;
            }

            for (i = MAX_NUMBER_OF_FILES; i < _files.Length; i++)
            {
                File.Delete(_files[i]);
            }

            this.listBox1.SelectedIndex = 0;
        }

        private void buttonRun_Click(object sender, EventArgs e)
        {
            string dir, fileNameFullPathConfigFile = Directory.GetCurrentDirectory() + "\\Config.txt";
            LocationSizeOfControlls locationSizeOfControlls;

            if (!File.Exists(fileNameFullPathConfigFile))
            {
                MessageBox.Show("The following file does not exist: " + fileNameFullPathConfigFile, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
                try
                {
                    ReadConfig(fileNameFullPathConfigFile, out dir, out locationSizeOfControlls);
                }
                catch(Exception ex)
                {
                    MessageBox.Show("An error occured when method ReadConfig was called! e.Message = " + ex.Message , "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }


                if (!Directory.Exists(dir))
                {
                    MessageBox.Show("The following directory does not exist: " + dir, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                _directory = dir;

                this.buttonRun.Visible = false;
                this.buttonRefresh.Visible = true;
                this.listBox1.Visible = true;
                this.textBox1.Visible = true;

                this.Location = new Point(locationSizeOfControlls.mx, locationSizeOfControlls.my);
                this.Size = new Size(locationSizeOfControlls.mw, locationSizeOfControlls.mh);
                this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
                this.listBox1.Location = new Point(locationSizeOfControlls.lx, locationSizeOfControlls.ly);
                this.listBox1.Size = new Size(locationSizeOfControlls.lw, locationSizeOfControlls.lh);
                this.textBox1.Location = new Point(locationSizeOfControlls.tx, locationSizeOfControlls.ty);
                this.textBox1.Size = new Size(locationSizeOfControlls.tw, locationSizeOfControlls.th);
            }
        }

        private string ReturnFileContents(string fileNameFullPath)
        {
            FileStream fileStream = new FileStream(fileNameFullPath, FileMode.Open, FileAccess.Read);
            StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8);
            string str = streamReader.ReadToEnd();
            streamReader.Close();
            fileStream.Close();

            return str;
        }

        private void ReadConfig(string fileNameFullPath, out string dir, out LocationSizeOfControlls locationSizeOfControlls)
        {
            string[] v = ReturnFileContents(fileNameFullPath).Split(new string[] { "\r\n" }, StringSplitOptions.None);
            dir = v[0];
            string[] ls = v[1].Split(' ');
            locationSizeOfControlls = new LocationSizeOfControlls();
            locationSizeOfControlls.mx = int.Parse(ls[0]);
            locationSizeOfControlls.my = int.Parse(ls[1]);
            locationSizeOfControlls.mw = int.Parse(ls[2]);
            locationSizeOfControlls.mh = int.Parse(ls[3]);
            locationSizeOfControlls.lx = int.Parse(ls[4]);
            locationSizeOfControlls.ly = int.Parse(ls[5]);
            locationSizeOfControlls.lw = int.Parse(ls[6]);
            locationSizeOfControlls.lh = int.Parse(ls[7]);
            locationSizeOfControlls.tx = int.Parse(ls[8]);
            locationSizeOfControlls.ty = int.Parse(ls[9]);
            locationSizeOfControlls.tw = int.Parse(ls[10]);
            locationSizeOfControlls.th = int.Parse(ls[11]);
        }

        private void Form1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            int mx, my, mw, mh, lx, ly, lw, lh, tx, ty, tw, th;
            string str;

            mx = this.Location.X;
            my = this.Location.Y;
            mw = this.Size.Width;
            mh = this.Size.Height;

            lx = this.listBox1.Location.X;
            ly = this.listBox1.Location.Y;
            lw = this.listBox1.Size.Width;
            lh = this.listBox1.Size.Height;

            tx = this.textBox1.Location.X;
            ty = this.textBox1.Location.Y;
            tw = this.textBox1.Size.Width;
            th = this.textBox1.Size.Height;

            str = string.Format("{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {10} {11}", mx, my, mw, mh, lx, ly, lw, lh, tx, ty, tw, th);

            MessageBox.Show(str, "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.textBox1.Text = ReturnFileContents(_files[this.listBox1.SelectedIndex]);
        }
    }

    public struct LocationSizeOfControlls
    {
        /*
         m = Main form
         l = Listbox
         t = Textbox
         x = Location x
         y = Location y
         w = Width
         h = Height
        */
        public int mx, my, mw, mh, lx, ly, lw, lh, tx, ty, tw, th;
    }
}
