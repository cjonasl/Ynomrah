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
        private ArrayList _listWithFiles;
        private readonly int MAX_NUMBER_OF_FILES = 50;

        public Form1()
        {
            InitializeComponent();
            this.buttonRefresh.Visible = false;
            this.listBox1.Visible = false;
            this.textBox1.Visible = false;
            _listWithFiles = new ArrayList();
            this.Start();
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
            string[] files = Directory.GetFiles(_directory);
            int numberOfNewFiles = 0, numberOfSamefiles = 0, numberOfDeletedFiles = 0;

            this.listBox1.Items.Clear();

            if (files.Length == 0)
            {
                MessageBox.Show(string.Format("There are no files to show. New files = 0. Deleted files = {0}.", _listWithFiles.Count.ToString()), "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }
                

            for(i = 0; i < (files.Length - 1); i++)
            {
                for(j = (i + 1); j < files.Length; j++)
                {
                    if (IsLower(files[i], files[j]))
                    {
                        tmp = files[j];
                        files[j] = files[i];
                        files[i] = tmp;
                    }
                }
            }
        
            m = (files.Length > MAX_NUMBER_OF_FILES) ? MAX_NUMBER_OF_FILES : files.Length;
            n = m;

            for (i = 0; i < m; i++)
            {
                if (_listWithFiles.IndexOf(files[i]) == -1)
                    numberOfNewFiles++;
                else
                    numberOfSamefiles++;

                this.listBox1.Items.Add(n.ToString());
                n--;
            }

            for (i = MAX_NUMBER_OF_FILES; i < files.Length; i++)
            {
                if (_listWithFiles.IndexOf(files[i]) >= -1)
                    numberOfDeletedFiles++;

                File.Delete(files[i]);
            }

            _listWithFiles = new ArrayList(files);

            this.listBox1.SelectedIndex = 0;

            MessageBox.Show(string.Format("List refreshed\r\nNew: {0}\r\nSame: {1}\r\nDeleted: {2}", numberOfNewFiles.ToString(), numberOfSamefiles.ToString(), numberOfDeletedFiles.ToString()), "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void Start()
        {
            string dir, fileNameFullPathConfigFile = Directory.GetCurrentDirectory() + "\\Config.txt";
            LocationSizeOfControlls locationSizeOfControlls;

            if (!File.Exists(fileNameFullPathConfigFile))
            {
                this.textBoxError.Text = "The following file does not exist: " + fileNameFullPathConfigFile;
                this.textBoxError.Select(0, 0);
            }
            else
            {
                try
                {
                    ReadConfig(fileNameFullPathConfigFile, out dir, out locationSizeOfControlls);
                }
                catch(Exception ex)
                {
                    this.textBoxError.Text = "An error occured when method ReadConfig was called! e.Message = " + ex.Message;
                    this.textBoxError.Select(0, 0);
                    return;
                }


                if (!Directory.Exists(dir))
                {
                    this.textBoxError.Text = "The following directory does not exist: " + dir;
                    this.textBoxError.Select(0, 0);
                    return;
                }

                _directory = dir;


                this.textBoxError.Visible = false;
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
            //In v[0] is folder full name to config-file for LogRequestResponse
            string[] v = ReturnFileContents(fileNameFullPath).Split(new string[] { "\r\n" }, StringSplitOptions.None);
            dir = v[1];
            string[] ls = v[2].Split(' ');
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
            this.textBox1.Text = ReturnFileContents((string)_listWithFiles[this.listBox1.SelectedIndex]);
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
